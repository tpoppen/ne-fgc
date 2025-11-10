import { CognitoJwtVerifier } from "aws-jwt-verify";
import type { CognitoJwtVerifierSingleUserPool } from 'aws-jwt-verify/cognito-verifier';
import cognitoIdentityProviderClient from "./cognitoIdentityProviderClient.js";

const BuildCognitoJWTVerifier = () => {
  let jwtVerifier: CognitoJwtVerifierSingleUserPool<{
    clientId: string;
    userPoolId: string;
    tokenUse: "access";
}>

  return {
    init: () => {
      jwtVerifier = CognitoJwtVerifier.create({
        clientId: cognitoIdentityProviderClient.getClientID(),
        userPoolId: cognitoIdentityProviderClient.getUserPoolID(),
        tokenUse: 'access',
      });
    },
    getJWTVerifier: () => jwtVerifier,
  }
};

export default BuildCognitoJWTVerifier();
