import { get_wix_services } from "../wixData/wixHttp.js";

let cachedData = null;
let lastFetchTime = 0;
let refreshPromise = null;
const CACHE_DURATION = 5 * 60 * 1000;

let collection_name = "Partenaire_test";
let wixData_url_get_FullData =
  "https://ciel-evasion.fr/_functions/WixData/" + collection_name + "/";

export function init_cachedData_partenaire() {
  cachedData = null;
  lastFetchTime = 0;
  refreshPromise = null;
  //refreshData();
  return {
    cachedData: cachedData,
    lastFetchTime: lastFetchTime,
    refreshPromise: refreshPromise,
  };
}

export async function FullData() {
  if (cachedData) {
    return cachedData;
  }
  if (!refreshPromise) {
    refreshPromise = refreshData();
  }
  return refreshPromise;
}

export async function refreshData() {
  try {
    const response = await get_wix_services(wixData_url_get_FullData);
    if (response?.data) {
      cachedData = response.data;
    }
  } catch (error) {
    console.error("Erreur lors du refresh :", error);
  } finally {
    refreshPromise = null;
  }
  return cachedData || [];
}

/*
export async function FullData(wixData_url_get_FullData) {
  const now = Date.now();
  const hasCache = cachedData && now - lastFetchTime < CACHE_DURATION * 2;
  if (hasCache) {
    if (now - lastFetchTime > CACHE_DURATION && !refreshPromise) {
      refreshPromise = refreshData(wixData_url_get_FullData);
    }
    return cachedData;
  }

  if (!refreshPromise) {
    refreshPromise = refreshData(wixData_url_get_FullData);
  }

  return refreshPromise;
}

async function refreshData(wixData_url_get_FullData) {
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
  */
