import { tri_reportByASC_ref } from '../utils/crud/function.js';
import { compressed_obj, decompressed_obj } from '../utils/compression/compression.js'
import { all_reservation } from '../services/reservation.js';

export async function getAllreservation(req, res) {
    let all_reservation_data = decompressed_obj(await all_reservation());
    
    res.json(all_reservation_data);
}
