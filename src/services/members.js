import { compressed_obj, decompressed_obj } from '../utils/compression/compression.js'
import { get_wix_services } from '../utils/wixData/wixHttp.js'

///import { all_members,get_membersById,get_membersByEmail } from '../services/ebillets.js';
let wixData_url = "https://ciel-evasion.fr/_functions/WixData/all_member/"
let collection_name = "Membre_everyone"
let wixData_url_get_FullData = "https://ciel-evasion.fr/_functions/WixData/" + collection_name + "/"

let cachedData = null;
let lastFetchTime = 0;
let refreshPromise = null;
const CACHE_DURATION = 5 * 60 * 1000;

export async function all_members_FullData() {
    const now = Date.now();
    const hasCache = cachedData && (now - lastFetchTime) < CACHE_DURATION * 2;
    if (hasCache) {
        if ((now - lastFetchTime) > CACHE_DURATION && !refreshPromise) {
            refreshPromise = refreshData();
        }
        return cachedData;
    }

    if (!refreshPromise) {
        refreshPromise = refreshData();
    }

    return refreshPromise;
}

async function refreshData() {
    try {
        const response = await get_wix_services(wixData_url_get_FullData);
        cachedData = response.data;
        lastFetchTime = Date.now();
        refreshPromise = null;
        return cachedData;
    } catch (error) {
        refreshPromise = null;
        console.error("Erreur lors du refresh :", error);
        return cachedData || [];
    }
}

//console.log(await all_members_FullData())
//console.log(await get_membersByEmail("quiquempoisaudrey@yahoo.fr"))
//console.log(await get_membersById('6e5646a3-697e-4a7f-8d33-53749be48815'))
//console.log(((await all_members()).data))

export async function get_membersByEmail(email) {
    return (await get_wix_services(wixData_url + "email/" + email)).data
}

export async function get_membersById(id) {
    return (await get_wix_services(wixData_url + "_id/" + id)).data
}

export async function all_members() {
    return await get_wix_services(wixData_url)
}
