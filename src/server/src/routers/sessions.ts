import { AuthenticationResultType, AuthFlowType, ConfirmForgotPasswordCommand, ConfirmSignUpCommand, ForgotPasswordCommand, GlobalSignOutCommand, InitiateAuthCommand, NotAuthorizedException } from '@aws-sdk/client-cognito-identity-provider';
import express from 'express';

import CreateUser from '../services/users/createUser.js';
import cognitoIdentityProviderClient from '../utils/cognitoIdentityProviderClient.js';
import getJWTFromAuthHeader from '../utils/getJWTFromAuthHeader.js';

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
      console.log({ result });

      const { AccessToken, RefreshToken } = result.AuthenticationResult as AuthenticationResultType;
      // TODO: cache refresh token
      res.cookie('auth_token', AccessToken, {
        // no js access
        httpOnly: true, 
        // only over HTTPS if prod
        secure: process.env.NODE_ENV === 'production',
        // 1 hour
        maxAge: 3600000,
        sameSite: 'strict'
      });

      res.status(200).send({ token: AccessToken });
    } catch (error: NotAuthorizedException | any) {
      if (error.$response?.statusCode === 400) {
        console.log({ resp: error.$response });
        res.status(400).send({ message: 'Invalid username or password ' });
        return;
      }

      console.log({ error });
      res.status(500).send({ message: 'Unexpected Error occurred' });
    }
  })
  .post('/logout', async (req, res) => {
    const accessToken = getJWTFromAuthHeader(req.headers.authorization);
    if (!accessToken) { return res.send(400); }

    const client = cognitoIdentityProviderClient.getClient();
    const confirmCommand = new GlobalSignOutCommand({
      AccessToken: accessToken
    });

    try {
      await client.send(confirmCommand);
      res.status(200).json({ message: 'Successfully Logged Out'}).send();
    } catch (error) {
      console.log({ error });
      res.status(500).send();
    }
  }).post('/forgot_password', async (req, res) => {
    const { username } = req.body;

    const client = cognitoIdentityProviderClient.getClient();
    const forgotPassword = new ForgotPasswordCommand({
      ClientId: cognitoIdentityProviderClient.getClientID(),
      SecretHash: cognitoIdentityProviderClient.getClientSecret(username),
      Username: username,
    });

    try {
      const response = await client.send(forgotPassword);
      res.status(200).send();
    } catch (error) {
      // TODO: handle error better, inspect aws error
      console.log({ error });
      res.status(500).send();
    }
  }).post('/forgot_password_confirm', async (req, res) => {
    const { username, password, confirmationCode } = req.body;

    const client = cognitoIdentityProviderClient.getClient();
    const forgotPasswordConfirm = new ConfirmForgotPasswordCommand({
      ClientId: cognitoIdentityProviderClient.getClientID(),
      SecretHash: cognitoIdentityProviderClient.getClientSecret(username),
      Username: username,
      Password: password,
      ConfirmationCode: confirmationCode,
    });

    try {
      const response = await client.send(forgotPasswordConfirm);
      res.status(200).send();
    } catch (error) {
      // TODO: handle error better, inspect aws error
      console.log({ error });
      res.status(500).send();
    }
  });
  
export default SessionsRouter;
