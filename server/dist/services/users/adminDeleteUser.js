import { AdminDeleteUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { deleteUser, fetchUser } from "../../accessors/userAccessor.js";
import cognitoIdentityProviderClient from "../../utils/cognitoIdentityProviderClient.js";
const AdminDeleteUser = async ({ userId }) => {
    const client = cognitoIdentityProviderClient.getClient();
    const userPoolId = cognitoIdentityProviderClient.getUserPoolID();
    try {
        const userInfo = await fetchUser({ userId });
        const deleteCommand = new AdminDeleteUserCommand({
            Username: userInfo?.username,
            UserPoolId: userPoolId,
        });
        const response = await client.send(deleteCommand);
        console.log({ cognitoDeleteResponse: response });
    }
    catch (error) {
        console.log({ AdminDeleteUserError: error });
        return { success: false, message: 'Failed to delete Cognito User' };
    }
    try {
        const success = await deleteUser({ userId });
        return { success };
    }
    catch (error) {
        console.log({ AdminDeleteDynamoUserError: error });
        return { success: false, message: 'Failed to delete Dynamo User Record' };
    }
};
export default AdminDeleteUser;
