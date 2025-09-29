import { compressed_obj, decompressed_obj } from '../utils/compression/compression.js'
///import { all_ebillet,get_ebilletById,get_ebilletByRef } from '../services/ebillets.js';

export async function get_ebilletByRef(ref) {
    let all = (await all_ebillet()).data;
    let result = all.filter(a => a.ref === ref);
    return result;
}

export async function get_ebilletById(id) {
    let all = (await all_ebillet()).data;
    let result = all.filter(a => a._id === id);
    return result;
}

export async function all_ebillet() {
    const response = await fetch("https://ciel-evasion.fr/_functions/myFunction/all_ebillet", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    return decompressed_obj(await response.json())
}

//console.log(await get_ebilletByRef("E241230-3"))
//console.log(await get_ebilletById('6650005f-61b4-497f-8cca-2e8b08299fe3'))
//console.log(await all_ebillet())