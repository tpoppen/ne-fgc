import { DynamoDBClient } from "@aws-sdk/client-dynamodb"

export type MigrationResult = {
  success: boolean,
  message: string,
}

export type Migration = {
  up: (dbClient: DynamoDBClient) => Promise<MigrationResult>,
  down: (dbClient: DynamoDBClient) => Promise<MigrationResult>,
}
