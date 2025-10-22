import type UserContext from "./userContext.js";

declare global {
  namespace Express {
    interface Request {
      userContext: UserContext
    }
  }
}
