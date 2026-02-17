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

import AiService from "../services/ai.js";

class OrdersService {
  constructor() {
  }
  async refresh() {
    return await refreshData(wixData_url);
  }
  async get_nom_prenom_byOrder(num) {

    let order = await this.getByNumber(num);
    let all_inputs = ""
    for (let item of (order).lineItems) {
      for (let input of item.customTextFields) {
        if (input.value) {
          all_inputs += " [ " + input.value + " ] "
        }
      }
    }
    return all_inputs
    //return await AiService.clean_input_client_by_Ai(all_inputs)
  }
  async getAll() {
    return await FullData(wixData_url);
  }
  async getById(id) {
    return (await get_wix_services(wixData_url + "_id/" + id)).data;
    //return (await this.getAll()).find((item) => item._id === id);
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