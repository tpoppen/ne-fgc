import { createContext } from "react";

export type UserSessionInfo = {
  token: string;
  permissions: string[];
}

export type SetUserSession = (userSessionInfo: UserSessionInfo | undefined) => void;

const UserSessionContext = createContext<{ setUserSession: SetUserSession, userSession: UserSessionInfo | undefined }>({
  setUserSession: (session: UserSessionInfo | undefined) => {},
  userSession: undefined,
});

export default UserSessionContext;
