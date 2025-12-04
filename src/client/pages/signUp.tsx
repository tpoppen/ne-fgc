import { Card, Input, Flex, Layout, Typography, Button, Divider } from "antd";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import NotificationContext from "../utils/notificationContext";

const SignUp = () => {
  const navigate = useNavigate();
  const notify = useContext(NotificationContext);
  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [verifyEmail, setVerifyEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');

  const [confirming, setConfirming] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');

  const signUp = () => {
    // TODO: put validation on fields themselves
    if (email !== verifyEmail) { return; }
    if (password !== verifyPassword) { return; }

    fetch('/api/sessions/sign_up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        nickname,
        email,
        password
      })
    }).then((resp) => {
      if (resp.status >= 400) {
        return notify.showNotification({
          type: 'error',
          message: 'Failed to create user',
        });
      }

      setConfirming(true);
      console.log({ resp });
    }).catch((error) => {
      console.log({ error });
    });
  }

  const confirm = () => {
    if (!confirmationCode) { return; }

    fetch('/api/sessions/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, confirmationCode })
    }).then((resp) => {
      // TODO: set session token cookie?
      if (resp.status >= 400) {
        return notify.showNotification({
          type: 'error',
          message: 'Failed to create user',
        });
      }
      console.log({ resp });
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
              <Typography.Title level={2}>Confirm Account</Typography.Title>
              <Input placeholder="Enter Confirmation Code" value={confirmationCode} onChange={(e) => setConfirmationCode(e.target.value)} />
              <Button onClick={confirm}>Confirm</Button>
            </>
          ) : (
            <>
              <Typography.Title level={2}>Sign Up</Typography.Title>
              <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
              <Input placeholder="Nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
              <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input placeholder="Verify Email" value={verifyEmail} onChange={(e) => setVerifyEmail(e.target.value)} />
              <Input.Password placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Input.Password placeholder="Verify Password" value={verifyPassword} onChange={(e) => setVerifyPassword(e.target.value)} />
              <Button type="primary" onClick={signUp}>Sign Up</Button>
              <Typography.Text>Already have an account? <Link to="/login">Login</Link></Typography.Text>
              <Typography.Text>
                Forgot your password? <Link to="/recoverAccount">Recover Account</Link>
              </Typography.Text>
            </>
          )}
        </Flex>
      </Card>
    </Layout>
  );
}

export default SignUp;
