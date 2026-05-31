import { Flex, Layout, theme } from 'antd';

const { useToken } = theme;

const Footer = () => {
  const { token } = useToken();
  return (
    <Layout.Footer>
      <Flex justify='center' gap={24} color={token.colorPrimaryBg}>
        <a target="_blank" href="https://discord.gg/Z3szXS3dF2">
          <img src="/discord-v2-svgrepo-com.svg" height={60} />
        </a>
        <a target="_blank" href="https://www.facebook.com/share/g/1AvMnjGAsL/">
          <img src="/facebook-color-svgrepo-com.svg" height={60} />
        </a>
        <a target="_blank" href="https://x.com/NebraskaFGC">
          <img src="/twitter-svgrepo-com.svg" height={60} />
        </a>
        <a target="_blank" href="https://www.youtube.com/@nebraskafgc">
          <img src="/youtube-color-svgrepo-com.svg" height={60} />
        </a>
        <a target="_blank" href="https://www.twitch.tv/cokemilktv">
          <img src="/twitch-v2-svgrepo-com.svg" height={60} />
        </a>
      </Flex>
    </Layout.Footer>
  )
};

export default Footer;
