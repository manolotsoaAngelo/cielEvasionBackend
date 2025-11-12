//import PartenairesService from "../services/partenaires.js";

import { get_wix_services } from "../utils/wixData/wixHttp.js";
import { FullData } from "../utils/fullData/partenaires.js";
let wixData_url = "https://ciel-evasion.fr/_functions/WixData/all_partenaire/";

class PartenairesService {
  constructor() {
    this.data = [];
  }

  async getAll() {
    return await FullData();
  }

  async getById(id) {
    return (await this.getAll()).find((item) => item._id === id);
  }
  async getByIdEbillet(IdEbillet) {
    return (await get_wix_services(wixData_url + "_idEbillet/" + IdEbillet))
      .data;
  }
}

export default new PartenairesService();