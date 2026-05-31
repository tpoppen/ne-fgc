import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

interface ENV_VARIABLES {
  AWS_COGNITO_CLIENT_ID: string;
  AWS_COGNITO_CLIENT_SECRET: string;
  AWS_COGNITO_USER_POOL_ID: string;
};

const client = new SecretsManagerClient({ region: "us-east-1" });

const loadEnvVariables = async (secretName: string) => {
  const getSecretsCommand = new GetSecretValueCommand({ SecretId: secretName });
  const response = await client.send(getSecretsCommand);

  if (response.SecretString) {
    const vars = JSON.parse(response.SecretString) as ENV_VARIABLES;
    process.env.AWS_COGNITO_CLIENT_ID = vars.AWS_COGNITO_CLIENT_ID;
    process.env.AWS_COGNITO_CLIENT_SECRET = vars.AWS_COGNITO_CLIENT_SECRET;
    process.env.AWS_COGNITO_USER_POOL_ID = vars.AWS_COGNITO_USER_POOL_ID;
  } else {
    return {};
  }
};

export default loadEnvVariables;
