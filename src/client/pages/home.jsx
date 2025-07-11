import styled from 'styled-components';

import Card from "../components/card";

const Section = styled.div`
  margin: 16px;
`;

const Header = styled.h2`
  margin-bottom: 16px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;

  overflow-x: scroll;
`;

const Home = () => {
  return (
    <div>
      <Section>
        <Header>Highlights</Header>
        <Container>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => 
            <Card key={item} />
          )}
        </Container>
      </Section>
      <Section>
        <Header>Events</Header>
        <Container>
          {[1, 2, 3, 4, 5].map((item) => 
            <Card key={item} />
          )}
        </Container>
      </Section>
    </div>
  )
};

export default Home;
