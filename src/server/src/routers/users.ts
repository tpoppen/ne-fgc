import express from 'express';
import type { Request, Response } from "express";

import { fetchUser, fetchUsers, updateUserPermissions } from '../accessors/userAccessor.js';
import authMiddleware from '../middleware/authMiddleware.js';
import addPermissionsMiddleware from '../middleware/permissionsMiddleware.js';
import AdminUpdateUser from '../services/users/adminUpdateUser.js';
import AdminDeleteUser from '../services/users/adminDeleteUser.js';
import UpdateUser from '../services/users/updateUser.js';
import DeleteUser from '../services/users/deleteUser.js';
import PERMISSIONS from '../utils/permissions.js';
import getJWTFromAuthHeader from '../utils/getJWTFromAuthHeader.js';

const UsersRouter = express.Router();

UsersRouter
  // admin only
  .get('/', [authMiddleware, addPermissionsMiddleware], async (req: Request, res: Response) => {
    if (!req.permissions.includes(PERMISSIONS.USER_ADMIN)) {
      return res.status(403).send();
    }

    const users = await fetchUsers();
    console.log({ users });
    res.status(200).send(users);
  })
  // admin only
  .put('/:userId/permissions', [authMiddleware, addPermissionsMiddleware], async (req: Request, res: Response) => {
    if (!req.permissions.includes(PERMISSIONS.USER_ADMIN)) {
      return res.status(403).send();
    }

    try {
      const updatedUser = await updateUserPermissions({
        userId: req.params.userId,
        permissions: req.body.permissions,
      });
      res.status(200).send(updatedUser);
    } catch (error) {
      res.status(500).send();
    }
  })
  // admin or matching user
  .get('/:userId', [authMiddleware, addPermissionsMiddleware], async (req: Request, res: Response) => {
    if (!req.permissions.includes(PERMISSIONS.USER_ADMIN) && req.params.userId !== req.userId) {
      return res.status(403).send();
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
        return res.sendStatus(500);
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
        return res.status(500).send();
      }
    }

    return res.status(403).send();
  })
  // admin or matching user
  .delete('/:userId', [authMiddleware, addPermissionsMiddleware], async (req: Request, res: Response) => {
    if (req.permissions.includes(PERMISSIONS.USER_ADMIN)) {
      try {
        // TODO: implement admin delete user
        AdminDeleteUser();
        return res.sendStatus(200);
      } catch (error) {
        return res.sendStatus(500);
      }
    } else if (req.params.userId === req.userId) {
      const accessToken = getJWTFromAuthHeader(req.headers.authorization)!;
      try {
        const deleted = await DeleteUser({ accessToken, userId: req.params.userId });
        if (deleted) { res.sendStatus(204); }
        else { res.status(500).send(); }
      } catch (error) {
        res.status(500).send();
      }
    }

    return res.status(403).send();
  });
  
export default UsersRouter;
