///import EbilletsService from "../services/ebillets.js";

import {
  get_wix_services,
  post_wix_services,
} from "../utils/wixData/wixHttp.js";
import { FullData } from "../utils/fullData/ebillets.js";
import { init_cachedData_ebillet } from "../utils/fullData/ebillets.js";
let wixData_url_get = "https://ciel-evasion.fr/_functions/WixData/all_ebillet/";
let wixData_url_post = "https://ciel-evasion.fr/_functions/WixData/ebillet/";
let collection_name = "Reports";
let wixData_url_get_FullData =
  "https://ciel-evasion.fr/_functions/WixData/" + collection_name + "/";

class EbilletsService {
  constructor() {
    this.data = [];
    init_cachedData_ebillet()
  }

  async getAll() {
    return await FullData(wixData_url_get_FullData);
  }

  async getById(id) {
    return (await this.getAll()).find((item) => item._id === id);
  }

  async updateEbillet(ebillet) {
    return (await post_wix_services(wixData_url_post + "update/", ebillet))
      .data;
  }

  async getByidArticle(idArticle) {
    return (await get_wix_services(wixData_url_get + "_idArticle/" + idArticle))
      .data;
  }

  async getByRef(ref) {
    return (await this.getAll()).find((item) => item.ref === ref);
  }

  async getAllEbilletByPartenaire(idPartenaire) {
    return (
      await get_wix_services(wixData_url_get + "partenaire/" + idPartenaire)
    ).data;
  }
  async getAllEbilletFactureByPartenaire(idPartenaire) {
    let now = new Date().getTime();
    return (await this.getAll()).filter(
      (item) => item.bonFacture && new Date(item.reglementPrevu).getTime() > now
    );
  }
}

export default new EbilletsService();
