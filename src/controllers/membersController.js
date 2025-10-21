import { tri_reportByASC_ref } from '../utils/crud/function.js';
import { compressed_obj, decompressed_obj } from '../utils/compression/compression.js'
import { all_members,get_membersById,get_membersByEmail } from '../services/members.js';

export async function get_all_members(req, res) {
    let all_members_data = (await all_members()).data;
    res.json(compressed_obj(all_members_data));
}
