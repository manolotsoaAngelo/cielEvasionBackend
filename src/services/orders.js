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
  create_order_new,
} from "../utils/crud/function.js";
import { FullData } from "../utils/fullData/orders.js";
import {
  init_cachedData_orders,
  refreshData,
} from "../utils/fullData/orders.js";
let wixData_url = "https://ciel-evasion.fr/_functions/WixData/all_order/";
let wixData_url_post = "https://ciel-evasion.fr/_functions/WixData/order/";

let collection_name = "Orders_everyone";
let wixData_url_get_FullData =
  "https://ciel-evasion.fr/_functions/WixData/" + collection_name + "/";

class OrdersService {
  constructor() {
  }
  async refresh() {
    return await refreshData(wixData_url);
  }
  async getAll() {
    return await FullData(wixData_url);
  }
  async getById(id) {
    return (await this.getAll()).find((item) => item._id === id);
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