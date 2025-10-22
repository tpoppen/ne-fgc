import type { JwtPayload } from "jsonwebtoken";

type JWTContents = {
  accessToken: string;
  iat: number;
}

export default JWTContents;
