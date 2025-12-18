import { CreateTableCommand, DescribeTableCommand, ScanCommand, TableStatus, BillingMode, PutItemCommand, TableClass, KeyType, ScalarAttributeType, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import sleep from "../utils/sleep.js";
const VERSIONS_TABLE_NAME = 'NE-FGC-DB-SCHEMA-VERSIONS';
const getVersionsTableName = () => `${VERSIONS_TABLE_NAME}-${process.env.NODE_ENV}`;
const checkTableStatus = async (client) => {
    const describeTable = new DescribeTableCommand({
        TableName: getVersionsTableName(),
    });
    try {
        const result = await client.send(describeTable);
        return {
            name: result.Table?.TableName,
            status: result.Table?.TableStatus,
            itemCount: result.Table?.ItemCount,
        };
    }
    catch (error) {
        return {
            name: getVersionsTableName(),
            status: 'MISSING',
            itemCount: 0,
        };
    }
};
const createVersionsTable = async (client) => {
    const createTable = new CreateTableCommand({
        TableName: getVersionsTableName(),
        TableClass: TableClass.STANDARD,
        BillingMode: BillingMode.PAY_PER_REQUEST,
        AttributeDefinitions: [{
                AttributeName: 'Migration',
                AttributeType: ScalarAttributeType.S,
            }],
        KeySchema: [{
                AttributeName: 'Migration',
                KeyType: KeyType.HASH,
            }],
    });
    try {
        console.log("Creating Versions Table");
        const result = await client.send(createTable);
        return {
            name: result.TableDescription?.TableName,
            status: result.TableDescription?.TableStatus,
            itemCount: result.TableDescription?.ItemCount,
        };
    }
    catch (error) {
        console.log("Failed to create versions table", error);
        return {
            name: getVersionsTableName(),
            status: 'MISSING',
            itemCount: 0,
        };
    }
};
const ensureVersionsTable = async (client) => {
    console.log("Ensuring Versions Table Exists and is Active");
    let pollCount = 0;
    let tableDescription = { name: '', status: '', itemCount: 0 };
    while (tableDescription.status != TableStatus.ACTIVE && pollCount < 10) {
        pollCount++;
        tableDescription = await checkTableStatus(client);
        if (tableDescription.status === TableStatus.ACTIVE) {
            return tableDescription;
        }
        if (tableDescription.status === 'MISSING') {
            tableDescription = await createVersionsTable(client);
        }
        await sleep(2000);
    }
    return tableDescription;
};
const getMigrationRecords = async (client) => {
    const getItemsCommand = new ScanCommand({ TableName: getVersionsTableName() });
    try {
        const response = await client.send(getItemsCommand);
        const migrationFileNames = response.Items?.map((dbRecord) => dbRecord.Migration.S);
        return migrationFileNames || [];
    }
    catch (error) {
        console.log("Failed to fetch items from Versions Table", error);
        throw error;
    }
};
const addMigrationRecord = async (client, recordName) => {
    console.log("Adding migration to Versions Table");
    const addItemCommand = new PutItemCommand({
        TableName: getVersionsTableName(),
        Item: { Migration: { S: recordName } }
    });
    try {
        const response = await client.send(addItemCommand);
        if (response.$metadata.httpStatusCode === 200) {
            return true;
        }
    }
    catch (error) {
        console.log(`Failed to add ${recordName} to Versions Table`);
    }
    return false;
};
const removeMigrationRecord = async (client, recordName) => {
    const removeItemCommand = new DeleteItemCommand({
        TableName: getVersionsTableName(),
        Key: { Migration: { S: recordName } }
    });
    try {
        const response = await client.send(removeItemCommand);
        if (response.$metadata.httpStatusCode === 200) {
            return true;
        }
    }
    catch (error) {
        console.log(`Failed to add ${recordName} to Versions Table`);
    }
    return false;
};
export { ensureVersionsTable, getMigrationRecords, addMigrationRecord, removeMigrationRecord, };
