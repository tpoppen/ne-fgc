import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';

const UsersRouter = express.Router();

UsersRouter
  // admin only
  .get('/', authMiddleware, (req, res) => { res.sendStatus(200) })
  // admin or matching user
  .get('/:userId', authMiddleware, (req, res) => { res.sendStatus(200) })
  // admin or matching user
  .put('/:userId', authMiddleware, (req, res) => { res.sendStatus(200) })
  // admin or matching user
  .delete('/:userId', authMiddleware, (req, res) => { res.sendStatus(200) });
  
export default UsersRouter;
