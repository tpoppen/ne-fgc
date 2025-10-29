import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Migration } from "db/migrationTypes.js";

const migration: Migration = {
  up: (client: DynamoDBClient) => Promise.resolve({ success: true, message: 'Added Table' }),
  down: (client: DynamoDBClient) => Promise.resolve({ success: true, message: 'Deleted Table' }),
}

export default migration;
