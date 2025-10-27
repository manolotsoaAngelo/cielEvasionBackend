
//import OrdersService from "../services/orders.js";

import {
  get_wix_services,
  post_wix_services,
} from "../utils/wixData/wixHttp.js";
import {
  tri_reportByASC_ref,
  tri_ebilletByASC_ref,
  tri_ebilletByASC_Date,
  tri_ebilletByDEC_Date_Byrdv,
  create_order_new
} from "../utils/crud/function.js";
import { FullData } from "../utils/fullData/orders.js";


let wixData_url = "https://ciel-evasion.fr/_functions/WixData/all_order/";
let wixData_url_post = "https://ciel-evasion.fr/_functions/WixData/order/";

let collection_name = "Orders_everyone";
let wixData_url_get_FullData =
  "https://ciel-evasion.fr/_functions/WixData/" + collection_name + "/";

class OrdersService {
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
  async insert(order) {
    return (await post_wix_services(wixData_url_post + "insert/", order)).data;
  }
  async create(wixData) {
    return await create_order_new(wixData);
  }
  async getByNumber(Number) {
    return (await get_wix_services(wixData_url + "number/" + Number)).data;
  }
}

export default new OrdersService();

/*
let collection_name = "Orders_everyone"
let wixData_url_get_FullData = "https://ciel-evasion.fr/_functions/WixData/" + collection_name + "/"

let cachedData = null;
let lastFetchTime = 0;
let refreshPromise = null;
const CACHE_DURATION = 5 * 60 * 1000;

export async function all_order_FullData() {
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
//console.log(await get_orderById('0a5ad329-d5cd-40d2-ace4-5d25fae1f758'))
//console.log(await all_order())
//console.log(await create_order_new())
//console.log(await get_orderByNumber("11468"))
//console.log(await all_order_FullData())

export async function insert_order(order) {
  return (await post_wix_services(wixData_url_post + "insert/", order)).data;
}

export async function get_orderById(id) {
  return (await get_wix_services(wixData_url + "_id/" + id)).data;
}

export async function get_orderByNumber(Number) {
  return (await get_wix_services(wixData_url + "number/" + Number)).data;
}

export async function all_order() {
  return await get_wix_services(wixData_url);
}
*/

