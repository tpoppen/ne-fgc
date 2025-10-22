import { AuthFlowType, ConfirmSignUpCommand, GlobalSignOutCommand, InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';
import express from 'express';
import JWT from 'jsonwebtoken';

import CreateUser from '../services/users/createUser.js';
import cognitoIdentityProviderClient from '../utils/cognitoIdentityProviderClient.js';

const SessionsRouter = express.Router();

SessionsRouter
  .post('/sign_up', async (req, res) => {
    try {
      const result = await CreateUser(req.body);
      res.json(result).send();
    } catch (error: Error | any) {
      res.status(500).send();
    }
  })
  .post('/confirm', async (req, res) => {
    const { username, confirmationCode } = req.body;

    const clientID = cognitoIdentityProviderClient.getClientID();
    const client = cognitoIdentityProviderClient.getClient();
    const clientSecret = cognitoIdentityProviderClient.getClientSecret(username);
    const confirmCommand = new ConfirmSignUpCommand({
      ClientId: clientID,
      SecretHash: clientSecret,
      Username: username,
      ConfirmationCode: confirmationCode,
    });

    try {
      const result = await client.send(confirmCommand);
      console.log({ result });
      res.status(200).send();
    } catch (error) {
      res.status(500).send();
    }
  })
  .post('/login', async (req, res) => {
    const { username, password } = req.body;

    const clientID = cognitoIdentityProviderClient.getClientID();
    const client = cognitoIdentityProviderClient.getClient();
    const clientSecret = cognitoIdentityProviderClient.getClientSecret(username);
    const confirmCommand = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: clientID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
        SECRET_HASH: clientSecret,
      }
    });

    try {
      const result = await client.send(confirmCommand);
      const token = JWT.sign({ accessToken: result.AuthenticationResult?.AccessToken }, process.env.JWT_SECRET!)
      res.status(200).send({ token });
    } catch (error) {
      res.status(500).send();
    }
  })
  .post('/logout', async (req, res) => {
    const accessToken = cognitoIdentityProviderClient.getAccessTokenFromAuthHeader(req.headers.authorization);
    if (!accessToken) {
      return res.send(400);
    }

    const client = cognitoIdentityProviderClient.getClient();
    const confirmCommand = new GlobalSignOutCommand({
      AccessToken: accessToken
    });

    try {
      await client.send(confirmCommand);
      res.status(200).json({ message: 'Successfully Logged Out'}).send();
    } catch (error) {
      res.status(500).send();
    }
  });
  
export default SessionsRouter;
