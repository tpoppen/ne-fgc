import { Card, Flex, Typography } from 'antd';

// TODO: use this code to handle horizontal scroll of lists

// var item = document.getElementById("MAIN");

// window.addEventListener("wheel", function (e) {
//   if (e.deltaY > 0) item.scrollLeft += 100;
//   else item.scrollLeft -= 100;
// });

const Home = () => {
  return (
    <div>
      <Flex>
        <Typography.Title level={3}>Highlights</Typography.Title>
        <Flex>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => 
            <Card key={item} />
          )}
        </Flex>
      </Flex>
      <Flex>
        <Typography.Title level={3}>Events</Typography.Title>
        <Flex>
          {[1, 2, 3, 4, 5].map((item) => 
            <Card key={item} />
          )}
        </Flex>
      </Flex>
    </div>
  )
};

export default Home;
