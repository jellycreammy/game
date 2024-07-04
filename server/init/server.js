const net = require('net');
const { Game, User } = require('../classes/game');
const { handleMessage } = require('../handlers/messageHandler');

const HOST = process.env.SERVER_HOST || '0.0.0.0';
const PORT = process.env.SERVER_PORT || 8080;

const game = new Game();

const server = net.createServer((socket) => {
    console.log('클라이언트 연결됨:', socket.remoteAddress, socket.remotePort);

    socket.on('data', (data) => {
        handleMessage(socket, data, game);  // 패킷 처리 함수 호출
    });

    socket.on('end', () => {
        console.log('클라이언트 연결 종료');
        game.removeUser(socket.userId);  // 사용자 제거
    });

    socket.on('error', (err) => {
        console.error('소켓 에러:', err);
    });
});

server.listen(PORT, HOST, () => {
    console.log(`서버가 ${HOST}:${PORT}에서 시작됨`);
});
