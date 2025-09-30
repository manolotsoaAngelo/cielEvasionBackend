import { compressed_obj, decompressed_obj } from '../utils/compression/compression.js'
import { get_wix_services } from '../utils/wixData/wixHttp.js'
///import { all_order,get_orderById } from '../services/orders.js';
let wixData_url = "https://ciel-evasion.fr/_functions/WixData/all_order/"

export async function get_orderById(id) {
    return (await get_wix_services(wixData_url + "_id/" + id)).data
}

export async function all_order() {
    return await get_wix_services(wixData_url)
}

//console.log(await get_orderById('0a5ad329-d5cd-40d2-ace4-5d25fae1f758'))
//console.log(await all_order())