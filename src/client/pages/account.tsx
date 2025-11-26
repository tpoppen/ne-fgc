import { Button, Card, Flex, Form, Input, Popconfirm, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import UserSessionContext from "../utils/userContext";
import { ApiContext } from "../utils/apiClientProvider";
import NotificationContext from "../utils/notificationContext";
import { useNavigate } from "react-router";

type UserInfo = {
  id: string;
  username: string;
  nickname: string;
  email: string;
}

type PasswordResetInfo = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const Account = () => {
  const [userInfoForm] = Form.useForm();
  const [passwordChangeForm] = Form.useForm();

  const navigate = useNavigate();
  const notify = useContext(NotificationContext);
  const { userSession, setUserSession } = useContext(UserSessionContext);
  const { send } = useContext(ApiContext);
  
  useEffect(() => {
    if (!userSession) { return; }

    send(`api/users/${userSession.userId}`, { method: 'GET' })
      .then(async (resp) => {
        const userJson = await resp.json() as UserInfo;
        userInfoForm.setFieldsValue({
          nickname: userJson.nickname,
          email: userJson.email,
        })
      }).catch((err) => {
        console.log({ err });
      });
  }, [userSession]);

  const updateUserInfo = async (values: UserInfo) => {
    const { nickname, email } = values;
    
    try {
      const response = await send(`/api/${userSession?.userId}`, {
        method: 'PUT',
        body: JSON.stringify({ nickname, email })
      });
      console.log({ updateAccountInfoResponse: response });
      notify.showNotification({ type: 'info', message: 'Updated Account Info' });
    } catch (error) {
      console.log({ updateUserError: error });
    }
  }

  const changePassword = async (values: PasswordResetInfo) => {
    const { oldPassword, newPassword } = values;

    try {
      const response = await send('/api/change_password', {
        method: 'POST',
        body: JSON.stringify({ oldPassword, newPassword })
      });

      console.log({ changePasswordResponse: response });
      notify.showNotification({
        type: 'info',
        message: 'Successfully Changed Password',
      });

      passwordChangeForm.resetFields();
    } catch (error) {
      console.log({ changePasswordError: error });
    }
  }

  const deleteAccount = async () => {
    try {
      const response = await send(`/api/${userSession?.userId}`, { method: 'DELETE' });
      console.log({ deleteResponse: response });
      notify.showNotification({
        message: 'Successfully Deleted Account',
        type: 'info'
      });

      setUserSession(null);
      navigate('/home');
    } catch (error) {
      console.log({ deleteUserError: error });
    }
  }

  return (
    <Flex vertical gap={8}>
      <Card>
        <Typography.Title level={3}>Account Info</Typography.Title>
        <Form
          name="Edit Account Info"
          form={userInfoForm}
          onFinish={updateUserInfo}
        >
          <Form.Item
            layout="vertical"
            label="Email"
            name="email"
          >
            <Input />
          </Form.Item>
          <Form.Item
            layout="vertical"
            label="Nickname"
            name="nickname"
          >
            <Input />
          </Form.Item>
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card>
        <Typography.Title level={3}>Change Password</Typography.Title>
        <Form
          name="Change Password"
          form={passwordChangeForm}
          onFinish={changePassword}
        >
          <Form.Item 
            layout="vertical" 
            label="Old Password"
            name="oldPassword"
          >
            <Input.Password />
          </Form.Item>
          <Form.Item 
            layout="vertical" 
            label="New Password"
            name="newPassword"
          >
            <Input.Password />
          </Form.Item>
          <Form.Item 
            layout="vertical" 
            label="Confirm New Password"
            name="confirmNewPassword"
          >
            <Input.Password />
          </Form.Item>
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Popconfirm
        title="Delete Account"
        description="Are you sure you want to delete your account? This action cannot be undone."
        okText="Yes, Delete my Account"
        cancelText="No"
        onConfirm={deleteAccount}
      >
        <Button danger>DELETE ACCOUNT</Button>
      </Popconfirm>
    </Flex>
  )
};

export default Account;
