import { createRoot} from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router";
import styled from 'styled-components';

import Home from './pages/home';
import Gallery from './pages/gallery';
import Personalities from './pages/personalities';
import Header from './components/header';
import Footer from './components/footer';

const Content = styled.div`
  padding: 16px;
`;

const root = document.getElementById('root');

createRoot(root)
.render(
  <BrowserRouter>
    <Header />
      <Content>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} /> 
          <Route path="/gallery" element={<Gallery />} /> 
          <Route path="/personalities" element={<Personalities />} /> 
        </Routes>
      </Content>
    <Footer />
  </BrowserRouter>
);
