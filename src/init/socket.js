import { Server as SocketIO } from 'socket.io';
import registerHandler from '../handlers/register.handler.js';

export const initSocket = (server) => {
  const io = new SocketIO();
  io.attach(server);

  registerHandler(io);
  io.on('connection', (socket) => {
    console.log('a user connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('user disconnected:', socket.id);
    });
    
    // 추가적인 소켓 이벤트 처리
  });

  return io;
};
