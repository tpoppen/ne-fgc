import { createRoot} from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router";
import styled from 'styled-components';

import Home from './pages/home';
import Gallery from './pages/gallery';
import Personalities from './pages/personalities';
import Header from './components/header';
import Footer from './components/footer';
import RepairsAndCommissions from './pages/repairs_and_commissions';

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
          <Route path="/repairs-and-commissions" element={<RepairsAndCommissions />} /> 
        </Routes>
      </Content>
    <Footer />
  </BrowserRouter>
);
