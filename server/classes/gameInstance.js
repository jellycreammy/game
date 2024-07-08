class GameInstance {
    constructor() {
        this.players = new Map();
    }

    addPlayer(socket, initPayload) {
        const player = {
            socket: socket,
            id: initPayload.deviceId,
            position: { x: 0, y: 0 },
        };
        this.players.set(socket, player);
        console.log(`Player ${player.id} added`);
    }

    removePlayer(socket) {
        const player = this.players.get(socket);
        if (player) {
            console.log(`Player ${player.id} removed`);
            this.players.delete(socket);
        }
    }

    updatePlayerLocation(socket, locationPayload) {
        const player = this.players.get(socket);
        if (player) {
            player.position.x = locationPayload.x;
            player.position.y = locationPayload.y;
            this.broadcastPlayerLocation();
        }
    }

    broadcastPlayerLocation() {
        const locations = Array.from(this.players.values()).map(player => ({
            id: player.id,
            x: player.position.x,
            y: player.position.y
        }));
        const payload = { users: locations };
        const message = root.lookupType('LocationUpdate').encode(payload).finish();
        for (const player of this.players.values()) {
            player.socket.write(message);
        }
    }
}

module.exports = GameInstance;
