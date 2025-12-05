import {
  compressed_obj,
  decompressed_obj,
} from "../utils/compression/compression.js";

import EbilletsService from "../services/ebillets.js";

//console.log(await EbilletsService.getByidArticle("27f91f30-a07d-005f-6b44-894cd81c9b2d"))
//console.log(await EbilletsService.getByRef("E10742-1"))
//console.log(await EbilletsService.getById('6650005f-61b4-497f-8cca-2e8b08299fe3'))
//console.log(await EbilletsService.getAll())
//console.log(await EbilletsService.getAllEbilletByPartenaire("15d9204a-b1d1-4288-8e5e-24e0fde1b8d3"))
//console.log(await EbilletsService.getAllEbilletFactureByPartenaire("15d9204a-b1d1-4288-8e5e-24e0fde1b8d3"))

export async function get_All_Ebillet_Facture(req, res) {
  let value = post(req, res);
  let result = await EbilletsService.getAllEbilletFacture();
  res.status(201).json(compressed_obj(result));
}

export async function get_All_Ebillet_Facture_ByPartenaire(req, res) {
  let value = post(req, res);
  let result = await EbilletsService.getAllEbilletFactureByPartenaire(value._id);
  res.status(201).json(compressed_obj(result));
}

export async function get_all_ebillet(req, res) {
  let all_ebillet_data = await EbilletsService.getAll();
  res.json(compressed_obj(all_ebillet_data));
}

function post(req, res) {
  const { data } = req.body;
  if (!data) return res.status(400).json({ error: "données requis" });
  return decompressed_obj(data);
}