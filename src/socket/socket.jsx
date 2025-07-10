
import { io } from "socket.io-client";

let socket;
  const apiUrl = import.meta.env.VITE_API_URL;


export const connectSocket = () => {
  if(!socket){
  socket = io(`${apiUrl}`, {
   withCredentials: true,
  });
}
  return socket;
};
export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};

export const getSocket = () => socket;
