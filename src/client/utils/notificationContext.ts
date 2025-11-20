
import { createContext } from "react";

export type NotificationConfig = {
  message: string,
  type: 'info' | 'warning' | 'error',
}

const NotificationContext = createContext({
  showNotification: (notificationConfig: NotificationConfig) => {}
});

export default NotificationContext;
