import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";

const ClientBuilder = () => {
  let client: DynamoDBClient;

  return {
    init: () => {
      const config: DynamoDBClientConfig = { region: process.env.AWS_REGION }
      client = new DynamoDBClient(config);
    },
    getClient: () => client,
  }
}

export default ClientBuilder();
