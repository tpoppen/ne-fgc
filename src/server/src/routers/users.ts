import express from 'express';
import type { Request, Response } from "express";
import { ChangePasswordCommand, NotAuthorizedException } from '@aws-sdk/client-cognito-identity-provider';

import { fetchUser, fetchUsers, updateUserPermissions } from '../accessors/userAccessor.js';
import authMiddleware from '../middleware/authMiddleware.js';
import addPermissionsMiddleware from '../middleware/permissionsMiddleware.js';

import AdminUpdateUser from '../services/users/adminUpdateUser.js';
import AdminDeleteUser from '../services/users/adminDeleteUser.js';
import UpdateUser from '../services/users/updateUser.js';
import DeleteUser from '../services/users/deleteUser.js';

import PERMISSIONS from '../utils/permissions.js';
import getJWTFromAuthHeader from '../utils/getJWTFromAuthHeader.js';
import cognitoIdentityProviderClient from '../utils/cognitoIdentityProviderClient.js';

const UsersRouter = express.Router();

UsersRouter
  // admin only
  .get('/', [authMiddleware, addPermissionsMiddleware], async (req: Request, res: Response) => {
    if (!req.permissions.includes(PERMISSIONS.USER_ADMIN)) {
      return res.status(403).send({ errorMessage: "Not Authorized" });
    }

    const users = await fetchUsers();
    console.log({ users });
    res.status(200).send(users);
  })
  // admin only
  .put('/:userId/permissions', [authMiddleware, addPermissionsMiddleware], async (req: Request, res: Response) => {
    if (!req.permissions.includes(PERMISSIONS.USER_ADMIN)) {
      return res.status(403).send({ errorMessage: "Not Authorized" });
    }

    try {
      const updatedUser = await updateUserPermissions({
        userId: req.params.userId,
        permissions: req.body.permissions,
      });
      res.status(200).send(updatedUser);
    } catch (error) {
      res.status(500).send({ errorMessage: "An unexpected error occurred" });
    }
  })
  // admin or matching user
  .get('/:userId', [authMiddleware, addPermissionsMiddleware], async (req: Request, res: Response) => {
    if (!req.permissions.includes(PERMISSIONS.USER_ADMIN) && req.params.userId !== req.userId) {
      return res.status(403).send({ errorMessage: "Not Authorized" });
    }

    const user = await fetchUser({ userId: req.params.userId });
    res.status(200).send(user);
  })
  // admin or matching user
  .put('/:userId', [authMiddleware, addPermissionsMiddleware], async (req: Request, res: Response) => {
    if (req.permissions.includes(PERMISSIONS.USER_ADMIN)) {
      try {
        // TODO: implement admin update user
        AdminUpdateUser();
        return res.sendStatus(200);
      } catch (error) {
        return res.status(500).send({ errorMessage: "An unexpected error occurred" });
      }
    } else if (req.params.userId === req.userId) {
      const accessToken = getJWTFromAuthHeader(req.headers.authorization)!;
      const { email, nickname } = req.body;

      try {
        const user = await UpdateUser({
          accessToken,
          userId: req.userId,
          email,
          nickname,
        });

        return res.status(200).send(user);
      } catch (error) {
        return res.status(500).send({ errorMessage: "An unexpected error occurred" });
      }
    }

    return res.status(403).send({ errorMessage: "Not Authorized" });
  })
  .put('/:userId/change_password', authMiddleware, async (req, res) => {
    const accessToken = getJWTFromAuthHeader(req.headers.authorization);
    if (!accessToken) { return res.status(401).send({ errorMessage: "Not Authenticated" }); }

    const client = cognitoIdentityProviderClient.getClient();
    const changePassword = new ChangePasswordCommand({
      PreviousPassword: req.body.oldPassword,
      ProposedPassword: req.body.newPassword,
      AccessToken: accessToken,
    });

    try {
      const response = await client.send(changePassword);
      console.log({ changePasswordResponse: response });
      return res.status(200).send();
    } catch(error: any | NotAuthorizedException) {
      // TODO: handle various errors: Limit Exceeded, Password History error, Invalid Password
      // inspect aws error for more specific error details
      if (error.$response) {
        return res.status(error.$response.statusCode).send({ errorMessage: error.message });
      }

      res.status(500).send({ errorMessage: "An unexpected error occurred" });
    }
  })
  // admin or matching user
  .delete('/:userId', [authMiddleware, addPermissionsMiddleware], async (req: Request, res: Response) => {
    if (req.permissions.includes(PERMISSIONS.USER_ADMIN)) {
      try {
        const result = await AdminDeleteUser({ userId: req.params.userId });
        if (result.success) {
          return res.status(200).send({ success: true });
        } else {
          return res.status(500).send({ success: false, errorMessage: result.message });
        }
      } catch (error) {
        return res.status(500).send({ errorMessage: "An unexpected error occurred" });
      }
    } else if (req.params.userId === req.userId) {
      const accessToken = getJWTFromAuthHeader(req.headers.authorization)!;
      try {
        const deleted = await DeleteUser({ accessToken, userId: req.params.userId });
        if (deleted) { res.sendStatus(204); }
        else { res.status(500).send({ errorMessage: "An unexpected error occurred" }); }
      } catch (error) {
        res.status(500).send({ errorMessage: "An unexpected error occurred" });
      }
    }

    return res.status(403).send({ errorMessage: "Not Authorized" });
  });
  
export default UsersRouter;
