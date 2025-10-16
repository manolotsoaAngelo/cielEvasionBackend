///import { all_ebillet,get_ebilletById,get_ebilletByRef,update_ebillet,get_ebilletByidArticle } from '../services/ebillets.js';
import { compressed_obj, decompressed_obj } from '../utils/compression/compression.js'
import { get_wix_services, post_wix_services } from '../utils/wixData/wixHttp.js'
let wixData_url_get = "https://ciel-evasion.fr/_functions/WixData/all_ebillet/"
let wixData_url_post = "https://ciel-evasion.fr/_functions/WixData/ebillet/"

//console.log(await update_ebillet())
//console.log(await get_ebilletByidArticle("27f91f30-a07d-005f-6b44-894cd81c9b2d"))
//console.log(await get_ebilletByRef("E241230-3"))
//console.log(await get_ebilletById('6650005f-61b4-497f-8cca-2e8b08299fe3'))
//console.log(await all_ebillet())

export async function update_ebillet(ebillet) {
    return (await post_wix_services(wixData_url_post + "update/", ebillet)).data
}

export async function get_ebilletByidArticle(id) {
    return (await get_wix_services(wixData_url_get + "_idArticle/" + id)).data
}

export async function get_ebilletByRef(ref) {
    return (await get_wix_services(wixData_url_get + "ref/" + ref)).data
}

export async function get_ebilletById(id) {
    return (await get_wix_services(wixData_url_get + "_id/" + id)).data
}

export async function all_ebillet() {
    return await get_wix_services(wixData_url_get)
}