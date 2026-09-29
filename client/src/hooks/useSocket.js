import { createContext, useContext } from "react";

export const SocketContext = createContext(null);

const useSocket = () => {
  return useContext(SocketContext);
};

export default useSocket;
