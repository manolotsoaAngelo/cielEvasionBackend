import { tri_reportByASC_ref } from '../utils/crud/function.js';
import { compressed_obj, decompressed_obj } from '../utils/compression/compression.js'
import { all_reservation } from '../services/reservation.js';

export async function get_all_reservation(req, res) {
    let all_reservation_data = await all_reservation();
    res.json(compressed_obj(all_reservation_data));
}
