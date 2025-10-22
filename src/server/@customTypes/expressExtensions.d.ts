import type JWTContents from "./jwtContents.js";

declare global {
  namespace Express {
    interface Request {
      auth: JWTContents
    }
  }
}
