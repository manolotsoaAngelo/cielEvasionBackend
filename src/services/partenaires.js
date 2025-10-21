import { get_wix_services } from '../utils/wixData/wixHttp.js'
let wixData_url = "https://ciel-evasion.fr/_functions/WixData/all_partenaire/"
let wixData_url_get_FullData = "https://ciel-evasion.fr/_functions/WixData/Partenaire_test/"

//import { all_partenaire,get_partenaireByIdEbillet } from '../services/partenaires.js';

//console.log(await all_partenaire())
//console.log(await all_partenaire_FullData())
//console.log(await get_partenaireByIdEbillet("6650005f-61b4-497f-8cca-2e8b08299fe3"))

export async function all_partenaire_FullData() {
    return (await get_wix_services(wixData_url_get_FullData)).data
}

export async function get_partenaireByIdEbillet(id) {
    return (await get_wix_services(wixData_url + "_idEbillet/" + id)).data
}

export async function all_partenaire() {
    return await get_wix_services(wixData_url)
}
