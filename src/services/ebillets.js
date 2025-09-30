import { compressed_obj, decompressed_obj } from '../utils/compression/compression.js'
import { get_wix_services } from '../utils/wixData/wixHttp.js'
///import { all_ebillet,get_ebilletById,get_ebilletByRef } from '../services/ebillets.js';
let wixData_url = "https://ciel-evasion.fr/_functions/WixData/all_ebillet/"

export async function get_ebilletByRef(ref) {
    return (await get_wix_services(wixData_url + "ref/" + ref)).data
}

export async function get_ebilletById(id) {
    return (await get_wix_services(wixData_url + "_id/" + id)).data
}

export async function all_ebillet() {
    return await get_wix_services(wixData_url)
}

//console.log(await get_ebilletByRef("E241230-3"))
//console.log(await get_ebilletById('6650005f-61b4-497f-8cca-2e8b08299fe3'))
//console.log(await all_ebillet())