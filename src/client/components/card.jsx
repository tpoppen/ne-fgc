import styled from 'styled-components';
import COLORS from '../utils/colors';

const Container = styled.div`
  background-color: ${COLORS.secondary.medium};
  width: 200px;
  height: 200px;
  padding: 16px;

  border-radius: 16px;
`;

const Placeholder = styled.div`
  background-color: ${COLORS.secondary.light};
  width: 174px;
  height: 140px;

  padding: 16px;

  border-radius: 8px;
`;


const Card = () => {
  return (
    <Container>
      <Placeholder>placeholder image</Placeholder>
      <p>content</p>
    </Container>
  )
};

export default Card;
