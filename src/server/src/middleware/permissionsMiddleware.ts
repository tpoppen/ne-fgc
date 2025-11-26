import type { Request, Response, NextFunction } from "express"
import { fetchUser } from "../accessors/userAccessor.js";

const addPermissionsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await fetchUser({ userId: req.userId });
  console.log({ permissionUser: user });
  if (!user) { 
    return res.status(401).send();
  }

  req.permissions = user.permissions;
  next();
}

export default addPermissionsMiddleware;
