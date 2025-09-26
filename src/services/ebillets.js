import { compressed_obj, decompressed_obj } from '../utils/compression/compression.js'
export async function all_ebillet() {
    const response = await fetch("https://ciel-evasion.fr/_functions/myFunction/all_ebillet", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    return await response.json();
}