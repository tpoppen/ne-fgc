import { Flex, Typography } from "antd";
import { useContext } from "react";
import UserSessionContext from "../utils/userContext";
import { jwtDecode } from "jwt-decode";

const Account = () => {
  const { userSession } = useContext(UserSessionContext);
  const vals = !!userSession ? jwtDecode(userSession?.token) : undefined;

  console.log({ vals });

  return (
    <Flex>
      <Typography.Title level={2}></Typography.Title>
    </Flex>
  )
};

export default Account;
