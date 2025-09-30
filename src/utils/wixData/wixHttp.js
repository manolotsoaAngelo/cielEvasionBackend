import { compressed_obj, decompressed_obj } from '../../utils/compression/compression.js'
//import { get_wix_services } from '../utils/wixData/wixHttp.js'

export async function get_wix_services(wixUrl) {
    const response = await fetch(wixUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    return decompressed_obj(await response.json())
}