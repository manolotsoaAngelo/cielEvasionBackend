//import UsersService from '../services/users.js';
import { get_wix_services } from "../utils/wixData/wixHttp.js";
import { FullData } from "../utils/fullData/users.js";
import { init_cachedData_users, refreshData } from "../utils/fullData/users.js";
let wixData_url = "https://ciel-evasion.fr/_functions/WixData/all_member/";
let collection_name = "Membre_everyone";
let wixData_url_get_FullData =
  "https://ciel-evasion.fr/_functions/WixData/" + collection_name + "/";

class UsersService {
  constructor() {
    this.data = [];
  }
  async refresh() {
    return await refreshData(wixData_url);
  }
  async getAll() {
    return await FullData(wixData_url);
  }

  async getById(id) {
    return (await get_wix_services(wixData_url + "_id/" + id)).data;
  }

  async getByEmail(email) {
    return this.data.find((item) => item.loginEmail === email);
  }
}

export default new UsersService();
