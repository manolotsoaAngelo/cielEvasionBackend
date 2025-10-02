import { tri_reportByASC_ref } from '../utils/crud/function.js';
import { compressed_obj, decompressed_obj } from '../utils/compression/compression.js'
import { all_ebillet } from '../services/ebillets.js';

export async function get_all_ebillet(req, res) {
    let all_ebillet_data = await all_ebillet();
    res.json(compressed_obj(all_ebillet_data));
}
