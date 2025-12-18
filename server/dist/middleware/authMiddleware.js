import { GetTokensFromRefreshTokenCommand } from "@aws-sdk/client-cognito-identity-provider";
import { jwtDecode } from "jwt-decode";
import getJWTFromAuthHeader from "../utils/getJWTFromAuthHeader.js";
import cognitoJWTVerifier from "../utils/cognitoJWTVerifier.js";
import localCache from "../utils/localCache.js";
import cognitoIdentityProviderClient from "../utils/cognitoIdentityProviderClient.js";
const refreshAuthToken = async (refreshToken, username) => {
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
            token: response.AuthenticationResult?.AccessToken,
            refreshToken: response.AuthenticationResult?.RefreshToken,
        };
    }
    catch (error) {
        // @ts-ignore
        console.log({ RefreshAuthError: error, message: error.message });
        return;
    }
};
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = getJWTFromAuthHeader(authHeader || '');
    console.log({ authHeader, token });
    if (authHeader && token) {
        const { username } = jwtDecode(token);
        const verifier = cognitoJWTVerifier.getJWTVerifier();
        try {
            const payload = await verifier.verify(token);
            req.userId = payload.sub;
            return next();
        }
        catch (error) {
            // EXPIRED token: refresh token, verify, and call next()
            if (error.message.includes('Token expired')) {
                // Get new token & refresh token
                const refreshToken = localCache.getCacheItem(token);
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
    return res.status(401).send({ message: "Not Authenticated" });
};
export default authMiddleware;
