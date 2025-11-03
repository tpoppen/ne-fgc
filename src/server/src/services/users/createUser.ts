import { SignUpCommand } from '@aws-sdk/client-cognito-identity-provider';

import cognitoIdentityProviderClient from '../../utils/cognitoIdentityProviderClient.js';
import { createUser } from '../../accessors/userAccessor.js';

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

  const signUpCommand = new SignUpCommand({
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
    const signUpResult = await client.send(signUpCommand);
    console.log({ signUpResult });
    const userId = signUpResult.UserSub!;
    const createUserResult = await createUser({ userId, ...userParams });
    return signUpResult;
  } catch (error) {
    // TODO: idk man
    throw error;
  }
}

export default CreateUser;
