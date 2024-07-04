class Game {
    constructor() {
        this.users = new Map();
    }

    addUser(user) {
        this.users.set(user.id, user);
    }

    removeUser(userId) {
        this.users.delete(userId);
    }

    updateUserLocation(userId, x, y) {
        if (this.users.has(userId)) {
            const user = this.users.get(userId);
            user.x = x;
            user.y = y;
        }
    }

    getUsers() {
        return Array.from(this.users.values());
    }
}

class User {
    constructor(id, playerId, x = 0, y = 0) {
        this.id = id;
        this.playerId = playerId;
        this.x = x;
        this.y = y;
    }
}

module.exports = { Game, User };
