///import EbilletsService from "../services/ebillets.js";

import {
  get_wix_services,
  post_wix_services,
} from "../utils/wixData/wixHttp.js";
import { FullData } from "../utils/fullData/ebillets.js";
import {
  init_cachedData_ebillet,
  refreshData,
} from "../utils/fullData/ebillets.js";

let wixData_url_get = "https://ciel-evasion.fr/_functions/WixData/all_ebillet/";
let wixData_url_post = "https://ciel-evasion.fr/_functions/WixData/ebillet/";

class EbilletsService {
  constructor() {
  }
  async refresh() {
    return await refreshData();
  }
  async getAll() {
    return await FullData();
  }

  async getById(id) {
    return (await this.getAll()).find((item) => item._id === id);
  }

  async updateEbillet(ebillet) {
    return (await post_wix_services(wixData_url_post + "update/", ebillet)).data;
  }

  async getByidArticle(idArticle) {
    return (await get_wix_services(wixData_url_get + "_idArticle/" + idArticle)).data;
  }

  async getByRef(ref) {
    return (await this.getAll()).find((item) => item.ref === ref);
  }

  async getAllEbilletByPartenaire(idPartenaire) {
    return (await get_wix_services(wixData_url_get + "partenaire/" + idPartenaire)).data;
  }
  async getAllEbilletFactureByPartenaire(idPartenaire) {
    let now = new Date().getTime();
    let allEbilletByPartenaire = await this.getAllEbilletByPartenaire(idPartenaire)
    if (allEbilletByPartenaire.length > 0) {
      return (allEbilletByPartenaire).filter((item) => item.bonFacture && new Date(item.reglementPrevu).getTime() > now);
    } else {
      return null
    }
  }
  async getAllEbilletFacture() {
    let now = new Date().getTime();
    let allEbillet = await this.getAll()
    if (allEbillet.length > 0) {
      return (allEbillet).filter((item) => item.bonFacture && new Date(item.reglementPrevu).getTime() > now);
    } else {
      return null
    }
  }
}

export default new EbilletsService();
