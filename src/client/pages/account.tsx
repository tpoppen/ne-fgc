import { Button, Card, Flex, Form, Input, Typography } from "antd";
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

  const submitDetails = () => {

  }

  const resetPassword = () => {

  }

  const deleteAccountClicked = () => {

  }

  const confirmDeleteAccount = () => {

  }

  return (
    <Flex vertical gap={8}>
      <Typography.Title level={2}>Account Details</Typography.Title>
      {userInfo && (
        <>
          <Card>
            <Typography.Title level={3}>{userInfo.username}</Typography.Title>
            <Form
              name="Edit Account Info"
              onFinish={submitDetails}
            >
              <Form.Item
                label="Email"
                name="email"
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Nickname"
                name="nickname"
              >
                <Input />
              </Form.Item>
                  <Form.Item label={null}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
            </Form>
          </Card>
          <Card>
            <Typography.Title level={3}>Reset Password</Typography.Title>
            <Form
              name="Password Reset"
              onFinish={resetPassword}
            >
              <Form.Item label="New Password"><Input.Password /></Form.Item>
              <Form.Item label="Confirm New Password"><Input.Password /></Form.Item>
              <Form.Item label={null}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Card>
          <Button type="primary" onClick={deleteAccountClicked}>DELETE ACCOUNT</Button>
        </>
      )}
    </Flex>
  )
};

export default Account;
