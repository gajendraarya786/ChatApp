
import { io } from "socket.io-client";

let socket;

export const connectSocket = () => {
  if(!socket){
  socket = io("http://localhost:8080", {
   withCredentials: true,
  });
}
  return socket;
};
export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};

export const getSocket = () => socket;
