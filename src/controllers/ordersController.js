import { compressed_obj, decompressed_obj } from '../utils/compression/compression.js'
import { all_order } from '../services/orders.js';

export async function get_all_order(req, res) {
    let all_order_data = (await all_order()).data;
    res.json(compressed_obj(all_order_data));
}
