import { JwtExpiredError } from "aws-jwt-verify/error";
import type { Request, Response, NextFunction } from "express"
import { jwtDecode } from "jwt-decode";

import getJWTFromAuthHeader from "../utils/getJWTFromAuthHeader.js";
import cognitoJWTVerifier from "../utils/cognitoJWTVerifier.js";
import localCache from "../utils/localCache.js";
import cognitoIdentityProviderClient from "../utils/cognitoIdentityProviderClient.js";
import { GetTokensFromRefreshTokenCommand } from "@aws-sdk/client-cognito-identity-provider";

const refreshAuthToken = async (refreshToken: string, username: string) => {
  const client = cognitoIdentityProviderClient.getClient();
  const clientID = cognitoIdentityProviderClient.getClientID();
  const secret = cognitoIdentityProviderClient.getClientSecret();

  const command = new GetTokensFromRefreshTokenCommand({
    ClientId: clientID,
    ClientSecret: secret,
    RefreshToken: refreshToken,
  });

  try { 
    const response = await client.send(command);
    console.log({ refreshResponse: response });
    return {
      token: response.AuthenticationResult?.AccessToken!,
      refreshToken: response.AuthenticationResult?.RefreshToken!,
    }
  } catch (error) {
    console.log({ RefreshAuthError: error });
    return;
  }
}

type AwsJwtPayload = {
  username: string;
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  console.log('Auth Middleware');
  const authHeader = req.headers.authorization;
  const token = getJWTFromAuthHeader(authHeader || '');

  if (authHeader && token) {
    const { username } = jwtDecode(token) as AwsJwtPayload;
    const verifier = cognitoJWTVerifier.getJWTVerifier();

    try {
      const payload = await verifier.verify(token);
      console.log({ payload });
      req.userId = payload.sub;
      return next();
    } catch (error: any | JwtExpiredError) {
      // EXPIRED token: refresh token, verify, and call next()
      console.log({ JWTError: error });
      if (error.message.includes('Token expired')) {
        // Get new token & refresh token
        const refreshToken = localCache.getCacheItem(token) as string | null;
        if (refreshToken) {
          console.log({ refreshToken });
          // if valid cache info, attempt refresh and continue request
          // TODO: fix InvalidParam error
          console.log({ username });
          const refreshResult = await refreshAuthToken(token, username);
          if (refreshResult) {
            console.log({ refreshResult})
            // cache new auth refresh token
            const { token: newToken, refreshToken: newRefreshToken } = refreshResult;
            localCache.deleteCacheItem(token);
            localCache.cacheItem(newToken, newRefreshToken);

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
  return res.sendStatus(401);
}

export default authMiddleware;
