import { SignUpCommand } from '@aws-sdk/client-cognito-identity-provider';

import cognitoIdentityProviderClient from '../../utils/cognitoIdentityProviderClient.js';

type CreateUserParams = {
  username: string;
  password: string;
  nickname: string;
  email: string;
}

const CreateUser = async (userParams: CreateUserParams) => {
  const { username, password, email, nickname } = userParams;
  const clientID = cognitoIdentityProviderClient.getClientID();
  const clientSecret = cognitoIdentityProviderClient.getClientSecret(username);
  const client = cognitoIdentityProviderClient.getClient();

  const signUpCommant = new SignUpCommand({
    ClientId: clientID,
    SecretHash: clientSecret,
    Username: username,
    Password: password,
    UserAttributes: [
      {
        Name: 'email',
        Value: email,
      },
      {
        Name: 'nickname',
        Value: nickname,
      }
    ]
  });

  try {
    return await client.send(signUpCommant);
  } catch (error) {
    // TODO: idk man
    throw error;
  }
}

export default CreateUser;
