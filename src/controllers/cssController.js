import {
  compressed_obj,
  decompressed_obj,
} from "../utils/compression/compression.js";

import CssService from "../services/css.js";


//console.log(await CssService.partenaires_header_footer_body_fix())
//console.log(await CssService.importateur_header_fix())
//console.log((await CssService.getAll_avis()))
//console.log((await CssService.getAll_avis())[0].images)
//console.log(await CssService.avis_Client_full_body())

export async function get_codejs_load_page(req, res) {
  let codejs_load_page = await CssService.codejs_load_page()
  res.json(compressed_obj(codejs_load_page));
}

export async function get_avis_Client_full_body(req, res) {
  let avis_Client_full_body = await CssService.avis_Client_full_body()
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