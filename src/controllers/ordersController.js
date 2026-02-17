import {
  compressed_obj,
  decompressed_obj,
} from "../utils/compression/compression.js";

import OrdersService from "../services/orders.js";

//console.log(await OrdersService.getById('b1a3a650-36d7-4ba0-9951-88875589c23c'))
//console.log(await OrdersService.getAll())
//console.log(await OrdersService.getByNumber(11468))
//console.log(await OrdersService.get_nom_prenom_byOrder(11468))

export async function get_all_order(req, res) {
  let all_order_data = await OrdersService.getAll();
  res.json(compressed_obj(all_order_data));
}

export async function post_nom_prenom_byOrder(req, res) {
  let value = post(req, res);
  let result = await OrdersService.get_nom_prenom_byOrder(value.number);
  res.status(201).json(compressed_obj(result));
}

function post(req, res) {
  const { data } = req.body;
  if (!data) return res.status(400).json({ error: "données requis" });
  return decompressed_obj(data);
}