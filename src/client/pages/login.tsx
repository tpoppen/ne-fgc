import { Card, Input, Flex, Layout, Typography, Button, Divider } from "antd";
import { Link } from "react-router";

const Login = () => {
  return (
    <Layout style={{ height: '100%' }}>
      <Card style={{ maxWidth: 500, margin: 'auto' }}>
        <Flex vertical gap={8}>
          <Typography.Title level={1}>NE FGC</Typography.Title>
          <Divider style={{ margin: 4 }} />
          <Typography.Title level={2}>Login</Typography.Title>
          <Input placeholder="Username" />
          <Input placeholder="Password" type="password" />
          <Button type="primary">Login</Button>
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
