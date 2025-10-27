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
  async getByIdEbillet(IdEbillet) {
    return (await get_wix_services(wixData_url + "_idEbillet/" + IdEbillet))
      .data;
  }
}

export default new PartenairesService();

/*
let cachedData = null;
let lastFetchTime = 0;
let refreshPromise = null;
const CACHE_DURATION = 5 * 60 * 1000;

export async function all_partenaire_FullData() {
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
//console.log(await all_partenaire())
//console.log(await all_partenaire_FullData())
//console.log(await get_partenaireByIdEbillet("6650005f-61b4-497f-8cca-2e8b08299fe3"))
/*
export async function get_partenaireByIdEbillet(id) {
  return (await get_wix_services(wixData_url + "_idEbillet/" + id)).data;
}

export async function all_partenaire() {
  return await get_wix_services(wixData_url);
}
*/