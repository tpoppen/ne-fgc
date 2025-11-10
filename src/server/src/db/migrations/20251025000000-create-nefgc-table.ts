import { BillingMode, CreateTableCommand, DeleteTableCommand, DescribeTableCommand, DynamoDBClient, KeyType, ScalarAttributeType, TableClass, TableStatus } from "@aws-sdk/client-dynamodb";
import { Migration } from "../migrationTypes.js";
import { getTableName, GS1, PRIMARY_KEY } from "../neFGCTable.js";
import sleep from "../../utils/sleep.js";

const pollForTableStatus = async (client: DynamoDBClient, status: TableStatus): Promise<boolean> => {
  const describeTable = new DescribeTableCommand({
    TableName: getTableName(),
  });

  try {
    const result = await client.send(describeTable);
    return result.Table?.TableStatus == status;
  } catch (error) {
    return false;
  }
}

const migration: Migration = {
  up: async (client: DynamoDBClient) => {
    const createTable = new CreateTableCommand({
      TableName: getTableName(),
      TableClass: TableClass.STANDARD,
      BillingMode: BillingMode.PAY_PER_REQUEST,
      AttributeDefinitions: [{
        AttributeName: PRIMARY_KEY.PK,
        AttributeType: ScalarAttributeType.S,
      }, {
        AttributeName: PRIMARY_KEY.SK,
        AttributeType: ScalarAttributeType.S,
      }, {
        AttributeName: GS1.PK,
        AttributeType: ScalarAttributeType.S,
      }, {
        AttributeName: GS1.SK,
        AttributeType: ScalarAttributeType.S,
      }],
      KeySchema: [{
        AttributeName: PRIMARY_KEY.PK,
        KeyType: KeyType.HASH,
      }, {
        AttributeName: PRIMARY_KEY.SK,
        KeyType: KeyType.RANGE,
      }],
      GlobalSecondaryIndexes: [{
        IndexName: GS1.INDEX_NAME,
        KeySchema: [{
          AttributeName: GS1.PK,
          KeyType: 'HASH',
        }, {
          AttributeName: GS1.SK,
          KeyType: 'RANGE',
        }],
        Projection: { ProjectionType: 'ALL' }
      }]
    });

    try {
      const result = await client.send(createTable);
      let pollCount = 0;
      let isActive = result.TableDescription?.TableStatus === TableStatus.ACTIVE;
      while (!isActive && pollCount < 10) {
        pollCount++;
        isActive = await pollForTableStatus(client, TableStatus.ACTIVE);
        if (!isActive) { await sleep(5000); }
      }

      return { success: isActive, message: '' };
    } catch (error: Error | any) {
      if (error?.message) {
        return { success: false, message: `Failed to create table: ${error.message}` };
      }
      return { success: false, message: `Failed to create table: Unknown Error` };
    }
  },
  down: async (client: DynamoDBClient) => {
    const deleteTable = new DeleteTableCommand({ TableName: getTableName() });
    try {
      const result = await client.send(deleteTable);

      let pollCount = 0;
      let isDeleting = result.TableDescription?.TableStatus == TableStatus.DELETING;
      while (!isDeleting && pollCount < 10) {
        pollCount++;
        isDeleting = await pollForTableStatus(client, TableStatus.DELETING);
      }

    return { success: true, message: 'DELETED NE-FGC DynamoDB Table' };
    } catch (error: Error | any) {
      if (error?.message) {
        return { success: false, message: `Failed to delete table: ${error.message}` };
      }
      return { success: false, message: `Failed to delete table: Unknown Error` };
    }
  },
}

export default migration;
