let io;

export const setSocketIO = (socketIO) => {
  io = socketIO;
};

export const getSocketIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
};
