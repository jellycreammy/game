import { Server } from 'socket.io';

export const initializeSocket = (server) => {
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('a user connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('user disconnected:', socket.id);
    });
    
    // 추가적인 소켓 이벤트 처리
  });

  return io;
};
