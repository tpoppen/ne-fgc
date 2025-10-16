import { createRoot} from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router";

import Home from './pages/home';
import Gallery from './pages/gallery';
import Personalities from './pages/personalities';

import RepairsAndCommissions from './pages/repairs_and_commissions';
import { Layout } from 'antd';

const root = document.getElementById('root')!;

createRoot(root)
  .render(
    <BrowserRouter>
      <Layout>
        <Layout.Header>

        </Layout.Header>
        <Layout.Content>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/home" element={<Home />} /> 
            <Route path="/gallery" element={<Gallery />} /> 
            <Route path="/personalities" element={<Personalities />} /> 
            <Route path="/repairs-and-commissions" element={<RepairsAndCommissions />} /> 
          </Routes>
        </Layout.Content>
        <Layout.Footer>
          <ul>
            <li>
              <a href="https://discord.gg/Z3szXS3dF2">
                <img src="/discord-v2-svgrepo-com.svg" height={60} />
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/share/g/1AvMnjGAsL/">
                <img src="/facebook-color-svgrepo-com.svg" height={60} />
              </a>
            </li>
            <li>
              <a href="https://x.com/NebraskaFGC">
                <img src="/twitter-svgrepo-com.svg" height={60} />
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/@nebraskafgc">
                <img src="/youtube-color-svgrepo-com.svg" height={60} />
              </a>
            </li>
            <li>
              <a href="https://www.twitch.tv/cokemilktv">
                <img src="/twitch-v2-svgrepo-com.svg" height={60} />
              </a>
            </li>
          </ul>
        </Layout.Footer>
      </Layout>
    </BrowserRouter>
  );
