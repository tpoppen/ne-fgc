import { createContext, useContext, useState } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import { ConfigProvider, Layout } from 'antd';

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

const ThemeContext = createContext({
  useDark: true,
  setTheme: (useDark: boolean) => {}
});

const AppLayout = () => {
  const { useDark, setTheme } = useContext(ThemeContext);

  return (
    <Layout style={{ height: '100%' }}>
      <Header theme={useDark ? 'dark' : 'light'} onThemeChange={() => setTheme(!useDark)}/>
        <Layout.Content style={{ padding: 24 }}>
         <Outlet />  
        </Layout.Content>
      <Footer />
    </Layout>
  )
}

const App = () => {
  const [useDark, setTheme] = useState(true);

  return (
    <ThemeContext.Provider value={{ useDark, setTheme }}>
      <ConfigProvider theme={useDark ? darkTheme : lightTheme}>
        <BrowserRouter>
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
        </BrowserRouter>
      </ConfigProvider>
    </ThemeContext.Provider>
  )
}

export default App;
