/**
 * Update Cognito user:
 * - email
 * - nickname
 * Update DynamoDB user with full update payload:
 * - email
 * - nickname
 * - photo (eventually)
 */
import { UpdateUserAttributesCommand } from "@aws-sdk/client-cognito-identity-provider";
import { updateUser } from "../../accessors/userAccessor.js";
import cognitoIdentityProviderClient from "../../utils/cognitoIdentityProviderClient.js";
const UpdateUser = async ({ accessToken, userId, email, nickname, }) => {
    try {
        const client = cognitoIdentityProviderClient.getClient();
        const updateUserCommand = new UpdateUserAttributesCommand({
            AccessToken: accessToken,
            UserAttributes: [{
                    Name: 'email',
                    Value: email,
                }, {
                    Name: 'nickname',
                    Value: nickname,
                }]
        });
        const updateCogUserResponse = await client.send(updateUserCommand);
        console.log({ updateCogUserResponse });
    }
    catch (error) {
        console.log({ updateCogUserError: error });
        throw error;
    }
    try {
        const updateUserRecordResponse = updateUser({ email, nickname, userId });
        console.log({ updateUserRecordResponse });
    }
    catch (error) {
        console.log({ updateUserRecordError: error });
        throw error;
    }
    return { email, nickname };
};
export default UpdateUser;
