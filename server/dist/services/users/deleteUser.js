/**
 * Delete Cognito user
 * Delete DynamoDB user
 */
import { DeleteUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { deleteUser } from "../../accessors/userAccessor.js";
import cognitoIdentityProviderClient from "../../utils/cognitoIdentityProviderClient.js";
const DeleteUser = async ({ accessToken, userId }) => {
    // Delete cognito user
    try {
        const deleteCommand = new DeleteUserCommand({ AccessToken: accessToken });
        const client = cognitoIdentityProviderClient.getClient();
        const deleteCogUserResponse = await client.send(deleteCommand);
        console.log({ deleteCogUserResponse });
    }
    catch (error) {
        console.log({ deleteCogUserError: error });
        throw error;
    }
    try {
        return await deleteUser({ userId });
    }
    catch (error) {
        console.log({ deleteUserRecordError: error });
        throw error;
    }
};
export default DeleteUser;
