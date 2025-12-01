import { AuthenticationResultType, AuthFlowType, ConfirmForgotPasswordCommand, ConfirmSignUpCommand, ForgotPasswordCommand, GlobalSignOutCommand, InitiateAuthCommand, NotAuthorizedException } from '@aws-sdk/client-cognito-identity-provider';
import express from 'express';
import { jwtDecode } from 'jwt-decode';

import authMiddleware from '../middleware/authMiddleware.js';
import CreateUser from '../services/users/createUser.js';
import cognitoIdentityProviderClient from '../utils/cognitoIdentityProviderClient.js';
import getJWTFromAuthHeader from '../utils/getJWTFromAuthHeader.js';
import localCache from '../utils/localCache.js';

const SessionsRouter = express.Router();

SessionsRouter
  .post('/sign_up', async (req, res) => {
    try {
      const result = await CreateUser(req.body);
      res.status(201).json(result).send();
    } catch (error: Error | any) {
      // TODO: handle various errors,
      // inspect aws error for more specific error details
      console.log({ error });
      res.status(500).send({ errorMessage: "An unexpected error occurred" });
    }
  })
  .post('/confirm', async (req, res) => {
    const { username, confirmationCode } = req.body;

    const clientID = cognitoIdentityProviderClient.getClientID();
    const client = cognitoIdentityProviderClient.getClient();
    const clientSecret = cognitoIdentityProviderClient.getSecretHash(username);
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
      // TODO: handle various errors,
      // inspect aws error for more specific error details
      console.log({ error });
      res.status(500).send({ errorMessage: "An unexpected error occurred" });
    }
  })
  .post('/login', async (req, res) => {
    const { username, password } = req.body;

    const clientID = cognitoIdentityProviderClient.getClientID();
    const client = cognitoIdentityProviderClient.getClient();
    const secretHash = cognitoIdentityProviderClient.getSecretHash(username);
    const loginCommand = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: clientID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
        SECRET_HASH: secretHash,
      }
    });

    try {
      const result = await client.send(loginCommand);
      
      const { AccessToken, RefreshToken } = result.AuthenticationResult as AuthenticationResultType;
      const userInfo = jwtDecode(AccessToken!);
      localCache.cacheItem(AccessToken!, RefreshToken!);

      res.status(200).send({
        token: AccessToken,
        userId: userInfo.sub!,
        permissions: [],
      });
    } catch (error: NotAuthorizedException | any) {
      if (error.$response?.statusCode === 400) {
        console.log({ resp: error.$response });
        res.status(400).send({ message: 'Invalid username or password ' });
        return;
      }

      console.log({ error });
      res.status(500).send({ errorMessage: "An unexpected error occurred" });
    }
  })
  .post('/logout', authMiddleware, async (req, res) => {
    const accessToken = getJWTFromAuthHeader(req.headers.authorization);
    if (!accessToken) { return res.status(401).send({ errorMessage: "Not Authenticated" }); }

    const client = cognitoIdentityProviderClient.getClient();
    const confirmCommand = new GlobalSignOutCommand({
      AccessToken: accessToken
    });

    try {
      localCache.deleteCacheItem(accessToken);
      await client.send(confirmCommand);
      res.status(200).json({ message: 'Successfully Logged Out'}).send();
    } catch (error) {
      // TODO: handle various errors,
      // inspect aws error for more specific error details
      console.log({ error });
      res.status(500).send({ errorMessage: "An unexpected error occurred" });
    }
  }).post('/reset_password', async (req, res) => {
    const { username } = req.body;

    const client = cognitoIdentityProviderClient.getClient();
    const forgotPassword = new ForgotPasswordCommand({
      ClientId: cognitoIdentityProviderClient.getClientID(),
      SecretHash: cognitoIdentityProviderClient.getSecretHash(username),
      Username: username,
    });

    try {
      await client.send(forgotPassword);
      res.status(200).send();
    } catch (error) {
      // TODO: handle various errors,
      // inspect aws error for more specific error details
      console.log({ error });
      res.status(500).send({ errorMessage: "An unexpected error occurred" });
    }
  }).post('/reset_password_confirm', async (req, res) => {
    const accessToken = getJWTFromAuthHeader(req.headers.authorization);
    const { username, password, confirmationCode } = req.body;

    const client = cognitoIdentityProviderClient.getClient();
    const forgotPasswordConfirm = new ConfirmForgotPasswordCommand({
      ClientId: cognitoIdentityProviderClient.getClientID(),
      SecretHash: cognitoIdentityProviderClient.getSecretHash(username),
      Username: username,
      Password: password,
      ConfirmationCode: confirmationCode,
    });

    try {
      // if reset password is called with a valid session, delete refresh token for active user
      if (accessToken) { localCache.deleteCacheItem(accessToken); }

      await client.send(forgotPasswordConfirm);
      res.status(200).send();
    } catch (error) {
      // TODO: handle various errors,
      // inspect aws error for more specific error details
      console.log({ error });
      res.status(500).send({ errorMessage: "An unexpected error occurred" });
    }
  });
  
export default SessionsRouter;
