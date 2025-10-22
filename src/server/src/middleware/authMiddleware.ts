import type { Request, Response, NextFunction } from "express"
import JWT from 'jsonwebtoken';
import getJWTFromAuthHeader from "../utils/getJWTFromAuthHeader.js";
import JWTContents from "../../@customTypes/jwtContents.js";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const bearerToken = req.headers.authorization;
  if (bearerToken) {
    const token = getJWTFromAuthHeader(bearerToken);
    JWT.verify(token, process.env.JWT_SECRET!, (err, jwtHash) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.auth = jwtHash as JWTContents;
      next();
    });
  } else {
    res.sendStatus(401);
  }  
}

export default authMiddleware;
