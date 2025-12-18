import express from 'express';
import UsersRouter from './users.js';
import SessionsRouter from './sessions.js';
const ApiRouter = express.Router();
ApiRouter.use('/users', UsersRouter);
ApiRouter.use('/sessions', SessionsRouter);
export default ApiRouter;
