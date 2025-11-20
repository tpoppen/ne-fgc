
/**
 * User model: Takes DynamoDB Object response to build a User model
 * Properties:
 * - id
 * - username
 * - email
 * - nickname
 * 
 */

import { AttributeValue } from "@aws-sdk/client-dynamodb";

class User {
  nickname: string;
  username: string;
  id: string;
  email: string;

  constructor(userData: Record<string, AttributeValue>) {
    console.log(userData.nickname)
    this.nickname = userData.nickname.S!;
    this.username = userData.username.S!;
    this.email = userData.email.S!;
    this.id = userData.id.S!
  }
}

export default User;
