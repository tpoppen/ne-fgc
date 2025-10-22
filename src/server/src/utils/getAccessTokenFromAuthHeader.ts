import { jwtDecode } from "jwt-decode";
import getJWTFromAuthHeader from "./getJWTFromAuthHeader.js";
import JWTContents from "../../@customTypes/jwtContents.js";

const getAccessTokenFromAuthHeader = (authHeader: string | undefined) => {
  if (authHeader) {
    const jwt = getJWTFromAuthHeader(authHeader);
    if (jwt) {
      const jwtPayload = jwtDecode(jwt) as JWTContents;
      return jwtPayload.accessToken;
    }
  }

  return undefined;
};

export default getAccessTokenFromAuthHeader;
