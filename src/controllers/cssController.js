import {
  compressed_obj,
  decompressed_obj,
} from "../utils/compression/compression.js";

import CssService from "../services/css.js";

//console.log(await PartenairesService.getAll())
//console.log(await PartenairesService.getByIdEbillet("6650005f-61b4-497f-8cca-2e8b08299fe3"))

export async function get_css_partenaires(req, res) {
  let partenaires_header_footer_body_fix = await CssService.partenaires_header_footer_body_fix()
  res.json(compressed_obj(partenaires_header_footer_body_fix));
/*
  res.setHeader("Content-Type", "text/css");
  let partenaires_header_footer_body_fix = await CssService.partenaires_header_footer_body_fix()
  res.send(partenaires_header_footer_body_fix);
  */
}