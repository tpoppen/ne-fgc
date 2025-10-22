import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { createHmac } from 'crypto';
import { jwtDecode } from 'jwt-decode';

const BuildCognitoSingleton = () => {
  let client: CognitoIdentityProviderClient;

  return {
    init: () => {
      client = new CognitoIdentityProviderClient({
        region: process.env.AWS_REGION || 'us-east-1'
      });
    },
    getClient: () => client,
    getClientID: () => process.env.AWS_COGNITO_CLIENT_ID,
    getClientSecret: (username: string) => {
      // cognito secret hash is a sha 256 HMAC of username + client id,
      // using client secret as the hash
      const secret = process.env.AWS_COGNITO_CLIENT_SECRET!;
      const clientID = process.env.AWS_COGNITO_CLIENT_ID!;
      const hash = createHmac('sha256', secret)
        .update(`${username}${clientID}`)
        .digest('base64');
      return hash;
    },
    getAccessTokenFromAuthHeader: (authHeader: string | undefined) => {
      if (authHeader) {
        const [prefix, token] = authHeader.split(' ');
        if (prefix === 'Bearer') {
          const jwtPayload = jwtDecode(token) as { accessToken: string };
          return jwtPayload.accessToken;
        }
      }

      return undefined;
    },
  }
}

export default BuildCognitoSingleton();
