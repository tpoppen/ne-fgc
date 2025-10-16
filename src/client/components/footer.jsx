import COLORS from '../utils/colors';

const containerStyles = `
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;

  margin: 0;
  height: 100px;
  width: 100%;

  display: flex;
  justify-content: center;

  background-color: ${COLORS.secondary.triple};

  ul {
    margin: auto;

    li {
      margin: 8px;
      display: inline-block;
      padding: 4px;
      color: black;
    }
  }
`;

const Footer = () => {
  return (
    <Container>
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
    </Container>
  )
};

export default Footer;
