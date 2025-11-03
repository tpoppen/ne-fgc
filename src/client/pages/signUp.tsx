import { Card, Input, Flex, Layout, Typography, Button, Divider } from "antd";
import { Link } from "react-router";

const SignUp = () => {
  return (
    <Layout style={{ height: '100%' }}>
      <Card style={{ maxWidth: 300, margin: 'auto' }}>
        <Flex vertical gap={8}>
          <Typography.Title level={1}>NE FGC</Typography.Title>
          <Divider style={{ margin: 4 }} />
          <Typography.Title level={2}>Sign Up</Typography.Title>
          <Input placeholder="Username" />
          <Input placeholder="Nickname" />
          <Input placeholder="Email" />
          <Input placeholder="Verify Email" />
          <Input placeholder="Password" type="password" />
          <Input placeholder="Verify Password" type="password" />
          <Button type="primary">Sign Up</Button>
          <Typography.Text>Already have an account? <Link to="/login">Login</Link></Typography.Text>
          <Typography.Text>
            Forgot your password? <Link to="/recoverAccount">Recover Account</Link>
          </Typography.Text>
        </Flex>
      </Card>
    </Layout>  )
}

export default SignUp;
