
///import EbilletsService from "../services/ebillets.js";

import {
  get_wix_services,
  post_wix_services,
} from "../utils/wixData/wixHttp.js";
import { FullData } from "../utils/fullData/ebillets.js";

class EbilletsService {
  constructor() {
    this.data = [];
    this._initPromise = this._init();
    this.wixData_url_get = "https://ciel-evasion.fr/_functions/WixData/all_ebillet/";
    this.wixData_url_post = "https://ciel-evasion.fr/_functions/WixData/ebillet/";
    let collection_name = "Reports";
    this.wixData_url_get_FullData =
      "https://ciel-evasion.fr/_functions/WixData/" + collection_name + "/";
  }

  async _init() {
    this.data = await FullData(this.wixData_url_get_FullData);
  }

  async getUrlFullData() {
    return this.wixData_url_get_FullData
  }

  async getAll() {
    await this._initPromise;
    return this.data;
  }

  async getById(id) {
    await this._initPromise;
    return this.data.find((item) => item._id === id);
  }

  async updateEbillet(ebillet) {
    return (await post_wix_services(this.wixData_url_post + "update/", ebillet))
      .data;
  }

  async getByidArticle(idArticle) {
    return (await get_wix_services(this.wixData_url_get + "_idArticle/" + idArticle))
      .data;
  }

  async getByRef(ref) {
    await this._initPromise;
    return this.data.find((item) => item.ref === ref);
  }

  async getAllEbilletByPartenaire(idPartenaire) {
    return (
      await get_wix_services(this.wixData_url_get + "partenaire/" + idPartenaire)
    ).data;
  }
}

export default new EbilletsService();
