import type { JwtPayload } from "jsonwebtoken";

type UserContext = string | JwtPayload | undefined

export default UserContext;
