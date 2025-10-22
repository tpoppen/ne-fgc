import express from 'express';
import { expressjwt } from 'express-jwt';

const UsersRouter = express.Router();

// TODO: figure out how to load jwt secret during build
// expressjwt({ secret: process.env.JWT_SECRET!, algorithms: ['HS256'] })
UsersRouter
  // admin only
  .get('/', () => {})
  // admin or matching user
  .get('/:userId', () => {})
  // admin or matching user
  .put('/:userId', () => {})
  // admin or matching user
  .delete('/:userId', () => {});
  
export default UsersRouter;
