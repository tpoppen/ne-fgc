import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { fetchUser, fetchUsers } from '../accessors/userAccessor.js';

const UsersRouter = express.Router();

UsersRouter
  // admin only
  .get('/', authMiddleware, async (req, res) => {
    const users = await fetchUsers();
    console.log({ users });
    res.status(200).send(users);
  })
  // admin or matching user
  .get('/:userId', authMiddleware, async (req, res) => {
    const user = await fetchUser({ userId: req.params.userId });
    console.log({ user });
    res.status(200).send(user);
  })
  // admin or matching user
  .put('/:userId', authMiddleware, (req, res) => { res.sendStatus(200) })
  // admin or matching user
  .delete('/:userId', authMiddleware, (req, res) => { res.sendStatus(200) });
  
export default UsersRouter;
