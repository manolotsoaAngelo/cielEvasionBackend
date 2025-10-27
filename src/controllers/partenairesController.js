import { compressed_obj, decompressed_obj } from '../utils/compression/compression.js'


import PartenairesService from "../services/partenaires.js";

//console.log(await PartenairesService.getAll())
//console.log(await PartenairesService.getByIdEbillet("6650005f-61b4-497f-8cca-2e8b08299fe3"))

export async function get_all_partenaire(req, res) {
    let all_partenaire_data = await PartenairesService.getAll();
    res.json(compressed_obj(all_partenaire_data));
}