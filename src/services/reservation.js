import { compressed_obj, decompressed_obj } from '../utils/compression/compression.js'
import { get_wix_services } from '../utils/wixData/wixHttp.js'

export async function all_reservation() {
    return await get_wix_services("https://ciel-evasion.fr/_functions/WixData/all_reservation")
}

console.log(await all_reservation())