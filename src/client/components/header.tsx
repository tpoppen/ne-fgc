import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { Button, Flex, Layout, Menu, Segmented, Typography } from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import { MoonOutlined, SunOutlined, UserOutlined } from '@ant-design/icons';

const BaseMenuItems: ItemType[] = [
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
];

const AccountMenuItem = {
  key: 'account',
  label: <Link to="/account">Account</Link>,
  icon: <UserOutlined />
}

type HeaderProps = {
  theme: 'light' | 'dark',
  onThemeChange: () => void
}

const Header = ({ theme, onThemeChange }: HeaderProps) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [navItems, setNavItems] = useState(BaseMenuItems);
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) {
      setNavItems([...BaseMenuItems, { ...AccountMenuItem, disabled: false }]);
    } else {
      setNavItems([...BaseMenuItems, { ...AccountMenuItem, disabled: true }]);
    }
  }, [loggedIn]);

  const loginLogoutClicked = () => {
    if (loggedIn) {
      // todo: end session, redirect
    } else {
      navigate('/login');
    }
  }
  
  return (
    <Layout.Header style={{ height: 'revert', padding: 0 }}>
      <Flex style={{ margin: '12px 24px' }}>
        <Link to="/home" style={{ lineHeight: 0 }}>
          <img src="seal_blue.png" height={120} />
        </Link>
        <Typography.Title level={1} style={{ flexGrow: 1, fontSize: 96, fontFamily: 'olibrick', color: '#efefef' }}>NE FGC</Typography.Title>
        <Flex vertical style={{ alignSelf: 'end' }}>
          <div>
            <Button type='primary' shape="round" size='large' onClick={loginLogoutClicked}>
              {loggedIn ? 'Logout' : 'Login'}
              <UserOutlined />
            </Button>
          </div>
          <div style={{ alignSelf: 'end' }}>
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
      <style blocking='render'>{`.menu li:nth-last-child(2) { margin-left: auto; }`}</style>
      <Menu className='menu' mode="horizontal" items={navItems} />
    </Layout.Header>
  )
};

export default Header;
