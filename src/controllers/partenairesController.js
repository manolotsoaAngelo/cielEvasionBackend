import { compressed_obj, decompressed_obj } from '../utils/compression/compression.js'
import { all_partenaire } from '../services/partenaires.js';

export async function get_all_partenaire(req, res) {
    let all_partenaire_data = (await all_partenaire()).data;
    res.json(compressed_obj(all_partenaire_data));
}
