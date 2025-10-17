import { Link } from 'react-router';
import { Button, Flex, Layout, Menu, Segmented, Typography } from 'antd';
import { MoonOutlined, SunOutlined, UserOutlined } from '@ant-design/icons';

const MenuItems = [
  {
    key: 'home',
    label: <Link to="/home">Events</Link>
  },
  {
    key: 'gear-rental',
    label: <Link to='/gear-rental'>Gear Rental</Link>
  },
  {
    key: 'gallery',
    label: <Link to="/gallery">Gallery</Link>
  },
  {
    key: 'commissions',
    label: <Link to="/repairs-and-commissions">Repairs and Commissions</Link>
  }
]

type HeaderProps = {
  theme: 'light' | 'dark',
  onThemeChange: () => void
}

const Header = ({ theme, onThemeChange }: HeaderProps) => {
  return (
    <Layout.Header style={{ height: 'revert', padding: 0 }}>
      <Flex style={{ margin: '12px 24px' }}>
        <Link to="/home" style={{ lineHeight: 0 }}>
          <img src="seal_blue.png" height={120} />
        </Link>
        <Typography.Title level={1} style={{ flexGrow: 1, fontSize: 96, fontFamily: 'olibrick', color: '#efefef' }}>NE FGC</Typography.Title>
        <Flex vertical style={{ alignSelf: 'end' }}>
          <div>
            <Button type='primary' shape="round" size='large'>
              Login
              <UserOutlined />
            </Button>
          </div>
          <div>
            <Segmented
              size='large'
              shape="round"
              value={theme}
              onChange={onThemeChange}
              options={[
                { value: 'light', icon: <SunOutlined /> },
                { value: 'dark', icon: <MoonOutlined /> },
              ]}
            />
          </div>
        </Flex>
      </Flex>
      <Menu mode="horizontal" items={MenuItems} />
    </Layout.Header>
  )
};

export default Header;
