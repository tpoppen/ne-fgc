import { Card, Input, Flex, Layout, Typography, Button, Divider } from "antd";
import { Link } from "react-router";

const RecoverAccount = () => {
  return (
    <Layout style={{ height: '100%' }}>
      <Card style={{ maxWidth: 500, margin: 'auto' }}>
        <Flex vertical gap={8}>
          <Typography.Title level={1}>NE FGC</Typography.Title>
          <Divider style={{ margin: 4 }} />
          <Typography.Title level={2}>Account Recovery</Typography.Title>
          <Input placeholder="Email" />
          <Button type="primary">Send Recovery Email</Button>
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
