
import { AttributeValue } from "@aws-sdk/client-dynamodb";

class User {
  nickname: string;
  username: string;
  id: string;
  email: string;
  permissions: string[];

  constructor(userData: Record<string, AttributeValue>) {
    this.nickname = userData.nickname.S!;
    this.username = userData.username.S!;
    this.email = userData.email.S!;
    this.id = userData.id.S!
    this.permissions = userData.permissions?.SS || [];
  }
}

export default User;
