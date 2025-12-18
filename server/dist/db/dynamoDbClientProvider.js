import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
const ClientBuilder = () => {
    let client;
    return {
        init: () => {
            const config = { region: process.env.AWS_REGION };
            client = new DynamoDBClient(config);
        },
        getClient: () => client,
    };
};
export default ClientBuilder();
