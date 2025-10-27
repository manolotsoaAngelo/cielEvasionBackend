
///import EbilletsService from "../services/ebillets.js";

import {
  get_wix_services,
  post_wix_services,
} from "../utils/wixData/wixHttp.js";
import { FullData } from "../utils/fullData/ebillets.js";

let wixData_url_get = "https://ciel-evasion.fr/_functions/WixData/all_ebillet/";
let wixData_url_post = "https://ciel-evasion.fr/_functions/WixData/ebillet/";
let collection_name = "Reports";
let wixData_url_get_FullData =
  "https://ciel-evasion.fr/_functions/WixData/" + collection_name + "/";

class EbilletsService {
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
    return this.data.find((item) => item._id === id);
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
    await this._initPromise;
    return this.data.find((item) => item.ref === ref);
  }

  async getAllEbilletByPartenaire(idPartenaire) {
    return (
      await get_wix_services(wixData_url_get + "partenaire/" + idPartenaire)
    ).data;
  }
}

export default new EbilletsService();

/*
let collection_name = "Reports"
let wixData_url_get_FullData = "https://ciel-evasion.fr/_functions/WixData/" + collection_name + "/"
let cachedData = null;
let lastFetchTime = 0;
let refreshPromise = null;
const CACHE_DURATION = 5 * 60 * 1000;

export function init_cachedData_ebillet(valeur) {
    cachedData = valeur
}

export async function all_ebillet_FullData() {
    const now = Date.now();
    const hasCache = cachedData && (now - lastFetchTime) < CACHE_DURATION * 2;
    if (hasCache) {
        if ((now - lastFetchTime) > CACHE_DURATION && !refreshPromise) {
            refreshPromise = refreshData();
        }
        return cachedData;
    }

    if (!refreshPromise) {
        refreshPromise = refreshData();
    }

    return refreshPromise;
}

async function refreshData() {
    try {
        const response = await get_wix_services(wixData_url_get_FullData);
        cachedData = response.data;
        lastFetchTime = Date.now();
        refreshPromise = null;
        return cachedData;
    } catch (error) {
        refreshPromise = null;
        console.error("Erreur lors du refresh :", error);
        return cachedData || [];
    }
}
*/

//console.log(await update_ebillet())
//console.log(await get_ebilletByidArticle("27f91f30-a07d-005f-6b44-894cd81c9b2d"))
//console.log(await get_ebilletByRef("E10742-1"))
//console.log(await get_ebilletById('6650005f-61b4-497f-8cca-2e8b08299fe3'))
//console.log(await all_ebillet())
//console.log(await get_All_ebilletByPartenaire("15d9204a-b1d1-4288-8e5e-24e0fde1b8d3"))
//console.log(await all_ebillet_FullData())
/*
export async function update_ebillet(ebillet) {
    return (await post_wix_services(wixData_url_post + "update/", ebillet)).data
}
export async function get_ebilletByidArticle(id) {
    return (await get_wix_services(wixData_url_get + "_idArticle/" + id)).data
}
export async function get_ebilletByRef(ref) {
    let all_ebillets = await all_ebillet_FullData();
    return all_ebillets.find(item => item.ref === ref)
    //return (await get_wix_services(wixData_url_get + "ref/" + ref)).data
}

export async function get_All_ebilletByPartenaire(partenaire) {
    return (await get_wix_services(wixData_url_get + "partenaire/" + partenaire)).data
}

export async function get_ebilletById(id) {
    let all_ebillets = await all_ebillet_FullData();
    return all_ebillets.find(item => item._id === id)
    //return (await get_wix_services(wixData_url_get + "_id/" + id)).data
}

export async function all_ebillet() {
    return await get_wix_services(wixData_url_get)
}
    
*/
