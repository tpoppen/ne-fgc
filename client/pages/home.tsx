import { Card, Flex, Typography } from 'antd';

const Home = () => {
  return (
    <Flex vertical>
      <Typography.Title level={2}>Coming Soon</Typography.Title>
      {/* <Flex gap={8}>
        {[1, 2, 3, 4, 5].map((item) => 
          <Card
            key={item}
            style={{ width: 200 }}
            cover={<img src="seal_blue.png" />}
          >
            <Flex vertical>
              <Typography.Title level={3}>Oasis</Typography.Title>
              <Typography.Text>December 8, 2025</Typography.Text>
              <Typography.Text>123 Test St.</Typography.Text>
              <Typography.Text>Omaha, NE 68130</Typography.Text>
              <Typography.Text><strong>Games</strong></Typography.Text>
              <ul>
                {['Tekken 8', 'Street Fighter 6', 'FF: COTW'].map((game) => (
                  <li key={game}>{game}</li>
                ))}
              </ul> 
            </Flex>
          </Card>
        )}
      </Flex> */}
    </Flex>
  )
};

export default Home;
