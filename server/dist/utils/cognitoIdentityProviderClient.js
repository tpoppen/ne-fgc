import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { createHmac } from 'crypto';
const BuildCognitoSingleton = () => {
    let client;
    return {
        init: () => {
            client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION || 'us-east-1' });
        },
        getClient: () => client,
        getClientID: () => process.env.AWS_COGNITO_CLIENT_ID,
        getClientSecret: () => (process.env.AWS_COGNITO_CLIENT_SECRET),
        getSecretHash: (username) => {
            // cognito secret hash is a sha 256 HMAC of username + client id,
            // using client secret as the hash
            const secret = process.env.AWS_COGNITO_CLIENT_SECRET;
            const clientID = process.env.AWS_COGNITO_CLIENT_ID;
            const hash = createHmac('sha256', secret)
                .update(`${username}${clientID}`)
                .digest('base64');
            return hash;
        },
        getUserPoolID: () => process.env.AWS_COGNITO_USER_POOL_ID,
    };
};
export default BuildCognitoSingleton();
