import { io } from 'socket.io-client';

const createSocketConnection = (token : string) => {
  const socket = io(`${process.env.Socket}`, {
                 extraHeaders: {
                Authorization: token,
             },transports: ['polling'],
             });

  return socket;
};

export default createSocketConnection;