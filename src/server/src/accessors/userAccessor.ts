import { DeleteItemCommand, GetItemCommand, PutItemCommand, QueryCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import dynamoDbClientProvider from "../db/dynamoDbClientProvider.js";
import { getTableName, GS1, PRIMARY_KEY } from "../db/neFGCTable.js";
import { isSuccessStatus } from "../utils/httpStatusHelper.js";
import User from "../models/user.js";

const U_PK = 'USERS';

const fetchUsers = async () => {
  const dbClient = dynamoDbClientProvider.getClient();
  const fetchUsers = new QueryCommand({
    TableName: getTableName(),
    Select: "ALL_ATTRIBUTES",
    KeyConditionExpression: "#pk = :pk",
    ExpressionAttributeNames: { '#pk': PRIMARY_KEY.PK },
    ExpressionAttributeValues: { ':pk': { S: U_PK } },
  });

  try {
    const result = await dbClient.send(fetchUsers);
    console.log({ result });
    return isSuccessStatus(result.$metadata.httpStatusCode);
  } catch (error) {
    console.log('USERS FETCH FAILURE', error);
    return false;
  }
};

type FetchUserParams = {
  userId: string;
};

const fetchUser = async (fetchParams: FetchUserParams) => {
  const dbClient = dynamoDbClientProvider.getClient();
  const getUser = new GetItemCommand({
    TableName: getTableName(),
    Key: {
      [PRIMARY_KEY.PK]: { S: U_PK },
      [PRIMARY_KEY.SK]: { S: `USER#${fetchParams.userId}` },
    }
  });

  try {
    const result = await dbClient.send(getUser);
    const user = new User(result.Item!);
    return user;
  } catch (error) {
    console.log('USER FETCH FAILURE', error);
    return false;
  }
};

type CreateUserParams = {
  userId: string,
  username: string,
  nickname: string,
  email: string,
}
const createUser = async (createParams: CreateUserParams) => {
  const dbClient = dynamoDbClientProvider.getClient();
  const createUser = new PutItemCommand({
    TableName: getTableName(),
    Item: {
      [PRIMARY_KEY.PK]: { S: U_PK } ,
      [PRIMARY_KEY.SK]: { S: `USER#${createParams.userId}` },
      [GS1.PK]: { S: `USER#${createParams.userId}` },
      [GS1.SK]: { S: `USER#${createParams.userId}` },
      type: { S: 'USER' },
      id: { S: createParams.userId },
      username: { S: createParams.username },
      nickname: { S: createParams.nickname },
      email: { S: createParams.email },
      permissions: { SS: [] }
    }
  });

  try {
    const result = await dbClient.send(createUser);
    console.log({ result });
    return isSuccessStatus(result.$metadata.httpStatusCode);
  } catch (error) {
    console.log('USER CREATE FAILURE', error);
    return false;
  }
};

type UpdateUserParams = {
  userId: string;
  email: string;
  nickname: string;
};
const updateUser = async (updateParams: UpdateUserParams) => {
  const dbClient = dynamoDbClientProvider.getClient();
  const updateUser = new UpdateItemCommand({
    TableName: getTableName(),
    Key: {
      [PRIMARY_KEY.PK]: { S: U_PK },
      [PRIMARY_KEY.SK]: { S: `USER#${updateParams.userId}` },
    },
    ExpressionAttributeNames: {
      '#n': 'nickname',
      '#e': 'email',
    },
    ExpressionAttributeValues: {
      ':n': { S: updateParams.nickname },
      ':e': { S: updateParams.email },
    },
    UpdateExpression: 'SET #n = :n, #e = :e'
  });

  try {
    const result = await dbClient.send(updateUser);
    console.log({ result });
    return isSuccessStatus(result.$metadata.httpStatusCode);
  } catch (error) {
    console.log('USER UPDATE FAILURE', error);
    return false;
  }
};

type UpdateUserPermissionsParams = {
  userId: string;
  permissions: string[];
}
const updateUserPermissions = async (updatePermissionsParams: UpdateUserPermissionsParams) => {
  const dbClient = dynamoDbClientProvider.getClient();
  const updateUser = new UpdateItemCommand({
    TableName: getTableName(),
    Key: {
      [PRIMARY_KEY.PK]: { S: U_PK },
      [PRIMARY_KEY.SK]: { S: `USER#${updatePermissionsParams.userId}` },
    },
    ExpressionAttributeNames: { '#p': 'permissions' },
    ExpressionAttributeValues: { ':p': { SS: updatePermissionsParams.permissions } },
    UpdateExpression: 'SET #p = :p'
  });

  try {
    const result = await dbClient.send(updateUser);
    console.log({ result });
    return isSuccessStatus(result.$metadata.httpStatusCode);
  } catch (error) {
    console.log('USER UPDATE PERMISSIONS FAILURE', error);
    return false;
  }
}

type DeleteUserParams = { userId: string; }
const deleteUser = async (deleteParams: DeleteUserParams) => {
  const dbClient = dynamoDbClientProvider.getClient();
  const deleteUser = new DeleteItemCommand({
    TableName: getTableName(),
    Key: {
      [PRIMARY_KEY.PK]: { S: `USER#${deleteParams.userId}` } ,
      [PRIMARY_KEY.SK]: { S: `USER#${deleteParams.userId}` },
    }
  });

  try {
    const result = await dbClient.send(deleteUser);
    console.log({ result });
    return isSuccessStatus(result.$metadata.httpStatusCode);
  } catch (error) {
    console.log('USER DELETE FAILURE', error);
    return false;
  }
};

export {
  fetchUsers,
  fetchUser,
  createUser,
  updateUser,
  updateUserPermissions,
  deleteUser,
}
