import { compressed_obj, decompressed_obj } from '../utils/compression/compression.js'
import { get_wix_services } from '../utils/wixData/wixHttp.js'
///import { all_members,get_membersById,get_membersByEmail } from '../services/ebillets.js';
let wixData_url = "https://ciel-evasion.fr/_functions/WixData/all_member/"

export async function get_membersByEmail(email) {
    return (await get_wix_services(wixData_url + "email/" + email)).data
}

export async function get_membersById(id) {
    return (await get_wix_services(wixData_url + "_id/" + id)).data
}

export async function all_members() {
    return await get_wix_services(wixData_url)
}

//console.log(await get_membersByEmail("quiquempoisaudrey@yahoo.fr"))
//console.log(await get_membersById('6e5646a3-697e-4a7f-8d33-53749be48815'))
//console.log(((await all_members()).data))