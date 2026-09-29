import { useContext } from "react";

import { NotificationContext } from "../context/NotificationContext.jsx";

const useNotifications = () => {
  return useContext(NotificationContext);
};

export default useNotifications;
