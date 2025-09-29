import { compressed_obj, decompressed_obj } from '../utils/compression/compression.js'
///import { all_order,get_orderById } from '../services/orders.js';

export async function get_orderById(id) {
    let all = (await all_order()).data;
    let result = all.filter(a => a._id === id);
    return result;
}

export async function all_order() {
    const response = await fetch("https://ciel-evasion.fr/_functions/myFunction/all_order", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    return decompressed_obj(await response.json())
}

//console.log(await get_orderById('b4d2c555-6866-40ca-9897-ab007825bb35'))
//console.log(await all_order())