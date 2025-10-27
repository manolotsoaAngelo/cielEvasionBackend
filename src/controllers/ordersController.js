import { compressed_obj, decompressed_obj } from '../utils/compression/compression.js'

import OrdersService from "../services/orders.js";

//console.log(await OrdersService.getById('b1a3a650-36d7-4ba0-9951-88875589c23c'))
//console.log(await OrdersService.getAll())
//console.log(await OrdersService.getByNumber("11468"))

export async function get_all_order(req, res) {
    let all_order_data = await OrdersService.getAll()
    res.json(compressed_obj(all_order_data));
}
