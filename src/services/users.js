
//import UsersService from '../services/users.js';

import { FullData } from '../utils/fullData/users.js';

let collection_name = "Membre_everyone"
let wixData_url_get_FullData = "https://ciel-evasion.fr/_functions/WixData/" + collection_name + "/"

class UsersService {
  constructor() {
    this.data = [];
    this._initPromise = this._init();
  }

  async _init() {
    this.data = await FullData(wixData_url_get_FullData);
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