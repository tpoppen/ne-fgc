import { Card, Input, Flex, Layout, Typography, Button, Divider } from "antd";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import UserSessionContext, { UserSessionInfo } from "../utils/userContext";

const Login = () => {
  const navigate = useNavigate();
  const { setUserSession } = useContext(UserSessionContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = () => {
    console.log({ username, password });
    fetch('/api/sessions/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    }).then(async (resp) => {
      const session = await resp.json() as UserSessionInfo;
      setUserSession(session);
      navigate('/');
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
          <Typography.Title level={2}>Login</Typography.Title>
          <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Input.Password placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          <Button type="primary" onClick={login}>Login</Button>
          <Typography.Text>
            Don't have an account? <Link to="/sign_up">Sign Up</Link>
          </Typography.Text>
          <Typography.Text>
            Forgot your password? <Link to="/recoverAccount">Recover Account</Link>
          </Typography.Text>
        </Flex>
      </Card>
    </Layout>
  );
}

export default Login;
