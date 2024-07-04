// server/handlers/messageHandler.js

const protobuf = require('../protobuf/compiled');
const InitialPayload = protobuf.lookupType("InitialPayload");
const LocationUpdatePayload = protobuf.lookupType("LocationUpdatePayload");

function decodeMessage(data) {
    // 적절한 디코딩 로직을 구현합니다.
    return InitialPayload.decode(data); // 예시로 InitialPayload 디코딩
}

function handleMessage(socket, data, game) {
    const message = decodeMessage(data);  // 프로토콜 버퍼 메시지 디코딩
    switch (message.$type.name) { // message.type 대신 message.$type.name 사용
        case 'InitialPayload':
            handleInitialPayload(socket, message, game);
            break;
        case 'LocationUpdatePayload':
            handleLocationUpdatePayload(socket, message, game);
            break;
        // 추가적인 패킷 타입 처리
    }
}

function handleInitialPayload(socket, message, game) {
    const user = new User(message.deviceId, message.playerId);
    game.addUser(user);
    socket.userId = message.deviceId;
    // 응답 패킷 전송 로직 추가
}

function handleLocationUpdatePayload(socket, message, game) {
    game.updateUserLocation(socket.userId, message.x, message.y);
    const users = game.getUsers();
    // 위치 업데이트 응답 패킷 전송 로직 추가
}

module.exports = { handleMessage };
