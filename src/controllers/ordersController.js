import { compressed_obj, decompressed_obj } from '../utils/compression/compression.js'

import OrdersService from "../services/orders.js";

//console.log(await OrdersService.getById('deed08ea-fd9b-4e0c-87a1-ebc090b48f39'))
//console.log(await OrdersService.getAll())
//console.log(await OrdersService.getByNumber("11468"))

export async function get_all_order(req, res) {
    let all_order_data = await OrdersService.getAll()
    res.json(compressed_obj(all_order_data));
}
