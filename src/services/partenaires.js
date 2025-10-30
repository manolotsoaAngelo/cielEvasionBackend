//import PartenairesService from "../services/partenaires.js";

import { get_wix_services } from "../utils/wixData/wixHttp.js";
import { FullData } from "../utils/fullData/partenaires.js";

let wixData_url = "https://ciel-evasion.fr/_functions/WixData/all_partenaire/";
let collection_name = "Partenaire_test";
let wixData_url_get_FullData =
  "https://ciel-evasion.fr/_functions/WixData/" + collection_name + "/";

class PartenairesService {
  constructor() {
    this.data = [];
  }

  async getAll() {
    return await FullData(wixData_url_get_FullData);
  }

  async getById(id) {
    await this._initPromise;
    return (await this.getAll()).find((item) => item._id === id);
  }
  async getByIdEbillet(IdEbillet) {
    return (await get_wix_services(wixData_url + "_idEbillet/" + IdEbillet))
      .data;
  }
}

export default new PartenairesService();