import { createContext } from "react";

export type UserSessionInfo = {
  userId: string;
  token: string;
  permissions: string[];
}

export type SetUserSession = (userSessionInfo: UserSessionInfo | null) => void;

const UserSessionContext = createContext<{
  setUserSession: SetUserSession,
  userSession: UserSessionInfo | null
}>({
  setUserSession: (session: UserSessionInfo | null) => {},
  userSession: null,
});

export default UserSessionContext;
