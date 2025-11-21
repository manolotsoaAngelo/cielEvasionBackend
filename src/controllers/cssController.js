import {
  compressed_obj,
  decompressed_obj,
} from "../utils/compression/compression.js";

import CssService from "../services/css.js";


//console.log(await CssService.partenaires_header_footer_body_fix())
//console.log(await CssService.importateur_header_fix())


export async function get_css_partenaires_header_footer_body_fix(req, res) {
  let partenaires_header_footer_body_fix = await CssService.partenaires_header_footer_body_fix()
  res.json(compressed_obj(partenaires_header_footer_body_fix));
}
export async function get_css_importateur_header_fix(req, res) {
  let importateur_header_fix = await CssService.importateur_header_fix()
  res.json(compressed_obj(importateur_header_fix));
}