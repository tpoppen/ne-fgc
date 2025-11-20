import { Card, Flex, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import UserSessionContext from "../utils/userContext";
import { jwtDecode } from "jwt-decode";
import buildHeaders from "../utils/buildHeaders";

type UserInfo = {
  id: string;
  username: string;
  nickname: string;
  email: string;
}

const Account = () => {
  const { userSession } = useContext(UserSessionContext);
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>(undefined);

  useEffect(() => {
    if (!userSession) { return; }

    fetch(
      `api/users/${userSession.userId}`,
      { headers: buildHeaders(userSession?.token) }
    ).then(async (resp) => {
      const userJson = await resp.json() as UserInfo;
      setUserInfo(userJson);
    }).catch((err) => {
      console.log({ err });
    });
  }, [userSession]);

  /**
   * TODO:
   * - Build form to update:
   *  - email
   *  - nickname
   * - Build sub-form to reset password
   * - Add "delete account" button
   */

  return (
    <Flex vertical gap={8}>
      <Typography.Title level={2}>Account Details</Typography.Title>
      {userInfo && (
        <Card>
          <Typography.Title level={3}>{userInfo.username}</Typography.Title>
          
        </Card>
      )}
    </Flex>
  )
};

export default Account;
