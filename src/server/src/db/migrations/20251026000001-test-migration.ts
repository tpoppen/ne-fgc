import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Migration } from "db/migrationTypes.js";

const migration: Migration = {
  up: (client: DynamoDBClient) => Promise.resolve({ success: true, message: 'Tested Mig' }),
  down: (client: DynamoDBClient) => Promise.resolve({ success: true, message: 'Tested Undo Mig' }),
}

export default migration;
