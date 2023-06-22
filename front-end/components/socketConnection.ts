import { io } from 'socket.io-client';

const createSocketConnection = (token : string) => {
  const socket = io("http://localhost:3333", {
                 extraHeaders: {
                Authorization: token,
             }
             });

  return socket;
};

export default createSocketConnection;

