import { useEffect, useState } from "react";
import socket from "./socket.js";
import useAuth from "../hooks/useAuth.js";
import { SocketContext } from "../hooks/useSocket.js";

const SocketProvider = ({ children }) => {
  const { token, status } = useAuth();

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token || status !== "authenticated") {
      socket.disconnect();
      setConnected(false);

      return;
    }

    socket.auth = {
      token,
    };

    const handleConnect = () => {
      console.log("Socket connected:", socket.id);
      setConnected(true);
    };

    const handleDisconnect = (reason) => {
      console.log("Socket disconnected:", reason);
      setConnected(false);
    };

    const handleConnectError = (error) => {
      console.error("Socket connection error:", error.message);
      setConnected(false);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    socket.connect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);

      socket.disconnect();
      setConnected(false);
    };
  }, [token, status]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
