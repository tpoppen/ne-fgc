import { DeleteItemCommand, GetItemCommand, PutItemCommand, ScalarAttributeType, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import dynamoDbClientProvider from "../db/dynamoDbClientProvider.js";
import { getTableName, PRIMARY_KEY } from "../db/neFGCTable.js";
import { isSuccessStatus } from "../utils/httpStatusHelper.js";

const fetchUsers = async () => {
  // TODO: build a batch item get that uses a wildcard on USER# keys match
};

type FetchUserParams = {
  userId: string;
};

const fetchUser = async (fetchParams: FetchUserParams) => {
  const dbClient = dynamoDbClientProvider.getClient();
  const getUser = new GetItemCommand({
    TableName: getTableName(),
    Key: {
      [PRIMARY_KEY.PK]: { S: `USER#${fetchParams.userId}` },
      [PRIMARY_KEY.SK]: { S: `USER#${fetchParams.userId}` },
    }
  });

  try {
    const result = await dbClient.send(getUser);
    console.log({ result });
    return isSuccessStatus(result.$metadata.httpStatusCode);
  } catch (error) {
    console.log('USER FETCH FAILURE', error);
    return false;
  }
};

// Feature: add profile pictures eventually

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
      [PRIMARY_KEY.PK]: { S: `USER#${createParams.userId}` } ,
      [PRIMARY_KEY.SK]: { S: `USER#${createParams.userId}` },
      type: { S: 'USER' },
      id: { S: createParams.userId },
      username: { S: createParams.username },
      nickname: { S: createParams.nickname },
      email: { S: createParams.email },
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

type UpdateUserParams = CreateUserParams;
const updateUser = async (updateParams: UpdateUserParams) => {
  const dbClient = dynamoDbClientProvider.getClient();
  const updateUser = new UpdateItemCommand({
    TableName: getTableName(),
    Key: {
      [PRIMARY_KEY.PK]: { S: `USER#${updateParams.userId}` },
      [PRIMARY_KEY.SK]: { S: `USER#${updateParams.userId}` },
    },
    ExpressionAttributeNames: {
      '#u': 'username',
      '#n': 'nickname',
      '#e': 'email',
    },
    ExpressionAttributeValues: {
      ':u': { S: updateParams.username },
      ':n': { S: updateParams.nickname },
      ':e': { S: updateParams.email },
    },
    UpdateExpression: 'SET #u = :u, #n = :n, #e = :e'
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
  deleteUser,
}
