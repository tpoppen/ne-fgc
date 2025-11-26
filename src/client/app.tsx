import { createContext, useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import { ConfigProvider, Layout, notification } from 'antd';

import darkTheme from './themes/ne-dark-theme';
import lightTheme from './themes/ne-theme';
import Home from './pages/home';
import Gallery from './pages/gallery';
import Personalities from './pages/personalities';
import Header from './components/header';
import Footer from './components/footer';
import RepairsAndCommissions from './pages/repairsAndCommissions';
import GearRental from "./pages/gear_rental";
import Account from "./pages/account";
import SignUp from "./pages/signUp";
import Login from "./pages/login";
import RecoverAccount from "./pages/recoverAccount";
import NotificationContext, { NotificationConfig } from "./utils/notificationContext";
import UserSessionContext, { UserSessionInfo } from "./utils/userContext";
import ApiClientProvider from "./utils/apiClientProvider";

const SESSION_KEY = 'userSession';
const THEME_KEY = 'useLight';

const ThemeContext = createContext({
  useDark: true,
  setTheme: (useDark: boolean) => {}
});

const AppLayout = () => {
  const { useDark, setTheme } = useContext(ThemeContext);

  // load cached theme selection
  useEffect(() => {
    const selectedTheme = localStorage.getItem(THEME_KEY);
    setTheme(selectedTheme !== 'light')
  }, []);

  const changeTheme = (useDark: boolean) => {
    localStorage.setItem(THEME_KEY, useDark ? 'dark' : 'light');
    setTheme(useDark);
  }

  return (
    <Layout style={{ height: '100%' }}>
      <Header theme={useDark ? 'dark' : 'light'} onThemeChange={() => changeTheme(!useDark)}/>
        <Layout.Content style={{ padding: 24 }}>
         <Outlet />  
        </Layout.Content>
      <Footer />
    </Layout>
  )
}

const App = () => {
  const [useDark, setTheme] = useState(true);
  const [userSession, setUserSession] = useState<UserSessionInfo | null>(null);
  const [api, contextHolder] = notification.useNotification();

  // load session info from local storage if present
  useEffect(() => {
    const sessionInfoString = localStorage.getItem(SESSION_KEY);
    if (sessionInfoString) {
      try {
        const sessionInfo = JSON.parse(sessionInfoString);
        setUserSession(sessionInfo);
      } catch (error) {
        console.log({ loadSessionError: error });
      }
    }
  }, []);

  const storeSessionInfo = (sessionInfo: UserSessionInfo | null) => {
    if (!sessionInfo) {
      localStorage.removeItem(SESSION_KEY);
    } else {
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionInfo));
    }

    setUserSession(sessionInfo);
  }

  const showNotification = ({ message, type }: NotificationConfig) => {
    switch(type) {
      case 'info':
        api.info({ message, placement: 'bottom' });
        break;
      case 'warning':
        api.warning({ message, placement: 'bottom' });
        break;
      case 'error':
        api.error({ message, placement: 'bottom' });
        break;
    }
  }

  return (
    <ThemeContext.Provider value={{ useDark, setTheme }}>
      <ConfigProvider theme={useDark ? darkTheme : lightTheme}>
        <UserSessionContext.Provider value={{ setUserSession: storeSessionInfo, userSession }}>
          <NotificationContext.Provider value={{ showNotification }}>
            {contextHolder}
            <BrowserRouter>
              <ApiClientProvider>
                <Routes>
                  <Route path="/sign_up" element={<SignUp />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/recoverAccount" element={<RecoverAccount />} />
                  <Route element={<AppLayout />}>
                    <Route index element={<Home />} />
                    <Route path="/home" element={<Home />} /> 
                    <Route path="/gallery" element={<Gallery />} /> 
                    <Route path="/gear-rental" element={<GearRental />} />
                    <Route path="/repairs-and-commissions" element={<RepairsAndCommissions />} />
                    <Route path="/account" element={<Account />} />
                  </Route>
                </Routes>
              </ApiClientProvider>
            </BrowserRouter>
          </NotificationContext.Provider>
        </UserSessionContext.Provider>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}

export default App;
