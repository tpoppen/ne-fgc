import type { Request, Response, NextFunction } from "express"
import getJWTFromAuthHeader from "../utils/getJWTFromAuthHeader.js";
import cognitoJWTVerifier from "../utils/cognitoJWTVerifier.js";

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = getJWTFromAuthHeader(authHeader || '');
  if (authHeader && token) {
    const verifier = cognitoJWTVerifier.getJWTVerifier();

    try {
      const payload = await verifier.verify(token);
      console.log({ payload });
      // VALID TOKEN
      return next();
    } catch (error) {
      // INVALID TOKEN
      console.log({ authError: error });
      return res.sendStatus(403);
    }
  }

  return res.sendStatus(401);
}

export default authMiddleware;
