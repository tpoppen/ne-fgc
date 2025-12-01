import { JwtExpiredError } from "aws-jwt-verify/error";
import { GetTokensFromRefreshTokenCommand } from "@aws-sdk/client-cognito-identity-provider";
import type { Request, Response, NextFunction } from "express"
import { jwtDecode } from "jwt-decode";

import getJWTFromAuthHeader from "../utils/getJWTFromAuthHeader.js";
import cognitoJWTVerifier from "../utils/cognitoJWTVerifier.js";
import localCache from "../utils/localCache.js";
import cognitoIdentityProviderClient from "../utils/cognitoIdentityProviderClient.js";

const refreshAuthToken = async (refreshToken: string, username: string) => {
  const client = cognitoIdentityProviderClient.getClient();
  const clientID = cognitoIdentityProviderClient.getClientID();
  const secret = cognitoIdentityProviderClient.getClientSecret();

  const loginCommand = new GetTokensFromRefreshTokenCommand({
    ClientId: clientID,
    ClientSecret: secret,
    RefreshToken: refreshToken,
  });

  try { 
    const response = await client.send(loginCommand);

    return {
      token: response.AuthenticationResult?.AccessToken!,
      refreshToken: response.AuthenticationResult?.RefreshToken!,
    }
  } catch (error) {
    // @ts-ignore
    console.log({ RefreshAuthError: error, message: error.message });
    return;
  }
}

type AwsJwtPayload = {
  sub: string;
  username: string;
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = getJWTFromAuthHeader(authHeader || '');

  if (authHeader && token) {
    const { username } = jwtDecode(token) as AwsJwtPayload;
    const verifier = cognitoJWTVerifier.getJWTVerifier();

    try {
      const payload = await verifier.verify(token);
      req.userId = payload.sub;

      return next();
    } catch (error: any | JwtExpiredError) {
      // EXPIRED token: refresh token, verify, and call next()
      if (error.message.includes('Token expired')) {
        // Get new token & refresh token
        const refreshToken = localCache.getCacheItem(token) as string | null;
        if (refreshToken) {
          // if valid cache info, attempt refresh and continue request
          const refreshResult = await refreshAuthToken(refreshToken, username);
          if (refreshResult) {
            const { token: newToken, refreshToken: newRefreshToken } = refreshResult;
            const payload = await verifier.verify(newToken);
            
            // cache new auth refresh token
            localCache.deleteCacheItem(token);
            localCache.cacheItem(newToken, newRefreshToken);

            // set user id for scope of request
            req.userId = payload.sub;
            // provide new auth token to client
            res.set('Authorization', `Bearer ${newToken}`);

            return next();
          }
        }
      }
      
      // INVALID token, redirect to login
      return res.redirect('/login');
    }
  }

  // No Auth Attached
  return res.status(401).send({ errorMessage: "Not Authenticated" });
}

export default authMiddleware;
