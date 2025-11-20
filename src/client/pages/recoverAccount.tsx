import { Card, Input, Flex, Layout, Typography, Button, Divider, notification } from "antd";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import NotificationContext from "../utils/notificationContext";

const RecoverAccount = () => {
  const navigate = useNavigate();
  const api = useContext(NotificationContext);
  const [username, setUsername] = useState('');
  
  const [confirming, setConfirming] = useState(false);
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');

  const submitForgot = () => {
    // TODO: put validation on fields themselves
    if (!username) { return; }

    fetch('/api/sessions/reset_password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    }).then((resp) => {
      if (resp.status !== 200) {
        console.log({ resp });
        return;
      }

      setConfirming(true);
    }).catch((error) => {
      console.log({ error });
    });
  }

  const submitConfirm = () => {
    // TODO: put validation on fields themselves
    if (!password && password !== verifyPassword) { return; }
    if (!confirmationCode) { return }

    fetch('/api/sessions/reset_password_confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, confirmationCode })
    }).then((resp) => {
      if (resp.status !== 200) {
        console.log({ resp });
        return;
      }

      api.showNotification({
        message: 'Successfully Reset Password',
        type: 'info',
      });
      navigate('/login');
    }).catch((error) => {
      console.log({ error });
    });
  }

  return (
    <Layout style={{ height: '100%' }}>
      <Card style={{ maxWidth: 500, margin: 'auto' }}>
        <Flex vertical gap={8}>
          <Typography.Title level={1}>NE FGC</Typography.Title>
          <Divider style={{ margin: 4 }} />
          {confirming ? (
            <>
              <Typography.Title level={2}>Confirm New Password</Typography.Title>
              <Input placeholder="Confirmation Code" onChange={(e) => setConfirmationCode(e.target.value)} />
              <Input placeholder="New Password" type="password" onChange={(e) => setPassword(e.target.value)} />
              <Input placeholder="Verify Password" type="password" onChange={(e) => setVerifyPassword(e.target.value)}/>
              <Button type="primary" onClick={submitConfirm}>Reset Password</Button>
            </>
          ): (
            <>
              <Typography.Title level={2}>Account Recovery</Typography.Title>
              <Input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
              <Button type="primary" onClick={submitForgot}>Send Recovery Email</Button>
            </>
          )}
          <Typography.Text>
            Know your account credentials? <Link to="/login">Login</Link>
          </Typography.Text>
          <Typography.Text>
            Don't have an account? <Link to="/sign_up">Sign Up</Link>
          </Typography.Text>
        </Flex>
      </Card>
    </Layout>
  );
}

export default RecoverAccount;
