import { compressed_obj, decompressed_obj } from '../utils/compression/compression.js'
export async function all_reservation() {
    const response = await fetch("https://ciel-evasion.fr/_functions/myFunction/all_reservation", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    return await response.json()
}