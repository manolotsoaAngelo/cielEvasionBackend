import { get_wix_services } from '../utils/wixData/wixHttp.js'
let wixData_url = "https://ciel-evasion.fr/_functions/WixData/all_partenaire/"

//import { all_partenaire,get_partenaireByIdEbillet } from '../services/partenaires.js';

export async function get_partenaireByIdEbillet(id) {
    return (await get_wix_services(wixData_url + "_idEbillet/" + id)).data
}

export async function all_partenaire() {
    return await get_wix_services(wixData_url)
}

//console.log(await all_partenaire())
//console.log(await get_partenaireByIdEbillet("6650005f-61b4-497f-8cca-2e8b08299fe3"))