const WebSocket = require('ws');

const socket = new WebSocket('ws://localhost:3333'); 
socket.on('open', () => {
  const message = {
    event: 'PrivateMessage',
    data: {
      receiver: 'example_receiver',
      content: 'Hello, this is a private message.',
    },
  };

  socket.send(JSON.stringify(message));
});

socket.on('message', (data) => {
  console.log('Received message:', data);
});

socket.on('close', () => {
  console.log('Socket connection closed');
});
