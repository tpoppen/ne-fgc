import { BrowserRouter, Routes, Route } from "react-router";
import { ConfigProvider, Layout } from 'antd';

import darkTheme from './themes/ne-dark-theme';
import lightTheme from './themes/ne-theme';
import Home from './pages/home';
import Gallery from './pages/gallery';
import Personalities from './pages/personalities';
import Header from './components/header';
import Footer from './components/footer';
import RepairsAndCommissions from './pages/repairs_and_commissions';
import { useState } from "react";
import GearRental from "./pages/gear_rental";
import Account from "./pages/account";

const App = () => {
  const [useDark, setTheme] = useState(true);

  return (
    <ConfigProvider theme={useDark ? darkTheme : lightTheme}>
      <BrowserRouter>
        <Layout style={{ height: '100%' }}>
          <Header theme={useDark ? 'dark' : 'light'} onThemeChange={() => setTheme(!useDark)}/>
          <Layout.Content style={{ padding: 24 }}>
            <Routes>
              <Route index element={<Home />} />
              <Route path="/home" element={<Home />} /> 
              <Route path="/gallery" element={<Gallery />} /> 
              <Route path="/gear-rental" element={<GearRental />} />
              <Route path="/repairs-and-commissions" element={<RepairsAndCommissions />} />
              <Route path="/account" element={<Account />} />
            </Routes>
          </Layout.Content>
          <Footer />
        </Layout>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App;
