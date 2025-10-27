import { all_members_FullData } from './members.js';

class UsersService {
  constructor() {
    this.data = [];
    this._initPromise = this._init();
  }

  async _init() {
    this.data = await all_members_FullData();
  }

  async getAll() {
    await this._initPromise;
    return this.data;
  }

  async getById(id) {
    await this._initPromise;
    return this.data.find(item => item._id === id);
  }

  async getByEmail(email) {
    await this._initPromise;
    return this.data.find(item => item.loginEmail === email);
  }
}

export default new UsersService();