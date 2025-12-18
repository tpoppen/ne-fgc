
import { createContext } from "react";

export type NotificationConfig = {
  message: string,
  placement?: 'bottom' | 'top' | 'topRight',
  type: 'info' | 'warning' | 'error',
}

const NotificationContext = createContext({
  showNotification: (notificationConfig: NotificationConfig) => {}
});

export default NotificationContext;
