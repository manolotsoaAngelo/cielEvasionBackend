import {
  compressed_obj,
  decompressed_obj,
} from "../utils/compression/compression.js";

import CssService from "../services/css.js";
import {
  facture_comptabilite_css
} from "../utils/css/facturation/comptabilite.js";
import {
  pop_rdv_css
} from "../utils/css/pop_rdv/rdv.js";

//console.log(await CssService.partenaires_header_footer_body_fix())
//console.log(await CssService.importateur_header_fix())
//console.log((await CssService.getAll_avis()))
//console.log((await CssService.getAll_avis())[0].images)
//console.log(await CssService.avis_Client_full_body())

export async function get_pop_rdv_css(req, res) {
  let pop = await pop_rdv_css()
  res.json(compressed_obj(pop));
}

export async function post_facture_comptabilite_css(req, res) {
  let value = post(req, res);
  let result = await facture_comptabilite_css(value.id_partenaire);
  res.status(201).json(compressed_obj(result));
}

export async function get_section_admin_hauteux_max(req, res) {
  let section_admin_hauteux_max = await CssService.section_admin_hauteux_max()
  res.json(compressed_obj(section_admin_hauteux_max));
}

export async function get_avis_Client_full_body(req, res) {
  let avis_Client_full_body = await CssService.avis_Client_full_body()
  //res.send(avis_Client_full_body)
  res.json(compressed_obj(avis_Client_full_body));
}

export async function get_css_partenaires_header_footer_body_fix(req, res) {
  let partenaires_header_footer_body_fix = await CssService.partenaires_header_footer_body_fix()
  res.json(compressed_obj(partenaires_header_footer_body_fix));
}
export async function get_css_importateur_header_fix(req, res) {
  let importateur_header_fix = await CssService.importateur_header_fix()
  res.json(compressed_obj(importateur_header_fix));
}

function post(req, res) {
  const { data } = req.body;
  if (!data) return res.status(400).json({ error: "données requis" });
  return decompressed_obj(data);
}