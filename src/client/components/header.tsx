import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { Button, Flex, Layout, Menu, Segmented, Typography } from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import { CalendarOutlined, ClockCircleOutlined, MoonOutlined, PictureOutlined, SunOutlined, TagOutlined, UserOutlined } from '@ant-design/icons';
import UserSessionContext from '../utils/userContext';
import buildHeaders from '../utils/buildHeaders';

const BaseMenuItems: ItemType[] = [
  {
    key: 'home',
    label: <Link to="/home">Events</Link>,
    icon: <CalendarOutlined />
  },
  {
    key: 'gear-rental',
    label: <Link to='/gear-rental'>Gear Rental</Link>,
    icon: <ClockCircleOutlined />
  },
  {
    key: 'gallery',
    label: <Link to="/gallery">Gallery</Link>,
    icon: <PictureOutlined />
  },
  {
    key: 'commissions',
    label: <Link to="/repairs-and-commissions">Repairs and Commissions</Link>,
    icon: <TagOutlined />
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
  const { setUserSession, userSession } = useContext(UserSessionContext);
  const [navItems, setNavItems] = useState(BaseMenuItems);
  const navigate = useNavigate();

  useEffect(() => {
    if (userSession) {
      setNavItems([...BaseMenuItems, AccountMenuItem]);
    } else {
      setNavItems([...BaseMenuItems]);
    }
  }, [userSession]);

  const loginLogoutClicked = async () => {
    if (userSession) {
      try {
        await fetch('/api/sessions/logout', {
          headers: buildHeaders(userSession.token),
          method: 'POST'
        });

        setUserSession(undefined);
      } catch (error) {
        // TODO: log failure to logout somewhere
        console.log({ error });
      }   
    }

    navigate('/login');
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
              {userSession ? 'Logout' : 'Login'}
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
      <Menu className='menu' mode="horizontal" items={navItems} />
    </Layout.Header>
  )
};

export default Header;
