
//import UsersService from '../services/users.js';
import { get_wix_services } from "../utils/wixData/wixHttp.js";
import { FullData } from '../utils/fullData/users.js';

let wixData_url = "https://ciel-evasion.fr/_functions/WixData/all_member/";
let collection_name = "Membre_everyone"
let wixData_url_get_FullData = "https://ciel-evasion.fr/_functions/WixData/" + collection_name + "/"

class UsersService {
  constructor() {
    this.data = [];
    this._initPromise = this._init();
  }

  async _init() {
    this.data = await FullData(wixData_url);
  }

  async getAll() {
    await this._initPromise;
    return this.data;
  }

  async getById(id) {
    return (await get_wix_services(wixData_url + "_id/" + id)).data;
  }

  async getByEmail(email) {
    await this._initPromise;
    return this.data.find(item => item.loginEmail === email);
  }
}

export default new UsersService();