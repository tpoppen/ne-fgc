import { CognitoJwtVerifier } from "aws-jwt-verify";
import cognitoIdentityProviderClient from "./cognitoIdentityProviderClient.js";
const BuildCognitoJWTVerifier = () => {
    let jwtVerifier;
    return {
        init: () => {
            jwtVerifier = CognitoJwtVerifier.create({
                clientId: cognitoIdentityProviderClient.getClientID(),
                userPoolId: cognitoIdentityProviderClient.getUserPoolID(),
                tokenUse: 'access',
            });
        },
        getJWTVerifier: () => jwtVerifier,
    };
};
export default BuildCognitoJWTVerifier();
