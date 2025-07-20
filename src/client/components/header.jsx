import { Link } from 'react-router';
import styled from 'styled-components';

import COLORS from '../utils/colors';

// TODO: make navigation mobile friendly
const Container = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  background-color: ${COLORS.primary.heavy};
  width: 100%;
  height: 200px;
`;

const InlineHeader = styled.div`
  display: flex;
  flex-direction: row;
  gap: 32px;
  padding: 0 16px;
`;

const BannerImageWrapper = styled(Link)`
  /* position: relative; */
  left: 0;
  top: 0;
`;

const BannerImage = styled.img`
  height: 150px;
  aspect-ratio: auto;
`;

const Title = styled.h1`
  font-family: olibrick;
  font-size: 140px;
`;

const Nav = styled.nav`
  /* position: absolute; */
  bottom: 0;

  width: 100%;

  ul {
    background-color: ${COLORS.secondary.triple};
    padding: 8px;

    li {
      display: inline-block;
      padding: 8px;
    }
  }
`;

const Header = () => {
  return (
    <Container>
      <InlineHeader>
        <BannerImageWrapper to="/">
          <BannerImage src="seal_blue.png" />
        </BannerImageWrapper>
        <Title>NE FGC</Title>
      </InlineHeader>
      <Nav>
        <ul>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/gallery">Gallery</Link></li>
          <li><Link to="/personalities">Personalities</Link></li>
          <li><Link to="/repairs-and-commissions">Repairs and Commissions</Link></li>
        </ul>
      </Nav>
    </Container>
  )
};

export default Header;
