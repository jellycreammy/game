export class UserModel {
    constructor() {
      this.users = {};
    }
  
    addUser(user) {
      this.users[user.id] = user;
    }
  
    getUser(id) {
      return this.users[id];
    }
  }
  