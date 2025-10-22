import type { Request, Response, NextFunction } from "express"
import JWT from 'jsonwebtoken';
import getJWTFromAuthHeader from "../utils/getJWTFromAuthHeader.js";
import JWTContents from "../../@customTypes/jwtContents.js";

// TODO: adapt for cookie?
// const token = req.cookies.auth_token;

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = getJWTFromAuthHeader(authHeader);
    if (token) {
      JWT.verify(token, process.env.JWT_SECRET!, (err, jwtHash) => {
        if (err) {
          return res.sendStatus(403);
        }
        req.auth = jwtHash as JWTContents;
        next();
      });
    }
  }
  
  res.sendStatus(401);  
}

export default authMiddleware;
