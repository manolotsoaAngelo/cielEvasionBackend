import { compressed_obj, decompressed_obj } from '../utils/compression/compression.js'
import { get_wix_services } from '../utils/wixData/wixHttp.js'
let wixData_url = "https://ciel-evasion.fr/_functions/WixData/all_reservation"

export async function all_reservation() {
    return await get_wix_services(wixData_url)
}

//console.log(await all_reservation())