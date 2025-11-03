import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { fromIni } from "@aws-sdk/credential-providers";

const ClientBuilder = () => {
  let client: DynamoDBClient;

  return {
    init: () => {
      // TODO: configure this to work for prod version of the app
      const config: DynamoDBClientConfig = {
        region: process.env.AWS_REGION,
        credentials: fromIni({
          profile: 'tpoppen-maintainer-poweruser'
        })
      }
      client = new DynamoDBClient(config);
    },
    getClient: () => client,
  }
}

export default ClientBuilder();
