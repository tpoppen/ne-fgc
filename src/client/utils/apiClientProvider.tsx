import { createContext, useContext } from "react";
import UserSessionContext from "./userContext";
import { useNavigate } from "react-router";

type Send = (path: string, options: RequestInit) => Promise<Response>;
export const ApiContext = createContext<{ send: Send }>({
  send: (_path: string, _options: RequestInit) => new Promise(() => {}),
});

type ApiHeaders = {
  'Accepts': string,
  'Content-Type': string,
  'Authorization'?: string;
}

const buildHeaders = (authToken: string | undefined, contentType: string | undefined = 'application/json') => {
  const headers: ApiHeaders = {
    'Accepts': 'application/json',
    'Content-Type': contentType,
  }
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  return headers;
};

const getAuthToken = (authHeader: string | null) => {
  if (!authHeader) { return undefined; }

  const [prefix, token] = authHeader.split(' ');
  if (prefix === 'Bearer') { return token; }

  return undefined;
}

type ProviderProps = {
  children: React.ReactNode;
}
// TODO: consume session context
const ApiClientProvider = ({ children }: ProviderProps) => {
  const { userSession, setUserSession } = useContext(UserSessionContext);
  const navigate = useNavigate();

  const send = async (path: string, options: RequestInit) => {
    try {
      const response = await fetch(path, {
        ...options,
        headers: buildHeaders(userSession?.token)
      });

      if (response.redirected && response.url.includes('/login')) {
        setUserSession(null);
        navigate('/login');
        return response;
      }

      const responseAuthHeader = response.headers.get('Authorization');
      if (userSession && responseAuthHeader) {
        const newAuthToken = getAuthToken(responseAuthHeader);
        const oldToken = userSession?.token || '';
        if (newAuthToken && newAuthToken !== oldToken) {
          setUserSession({ ...userSession, token: newAuthToken });
        }
      }

      return response;
    } catch (error) {
      console.log({ ClientProviderResponseError: error });
      throw error;
    }
  };
  
  return (
    <ApiContext.Provider value={{ send }}>
      {children}
    </ApiContext.Provider>
  )
}

export default ApiClientProvider;
