import { get_wix_services } from "../wixData/wixHttp.js";

let collection_name = "all_avis";
let wixData_url_get_FullData =
  "https://ciel-evasion.fr/_functions/WixData/" + collection_name + "/";

let cachedData = null;
let refreshPromise = null;

export function init_cachedData_avis() {
  cachedData = null;
  refreshPromise = null;
  return {
    cachedData: cachedData,
    refreshPromise: refreshPromise,
  };
}

export async function refreshData() {
  try {
    console.log("🔄 Refresh des données Avis depuis Wix...");
    const response = await get_wix_services(wixData_url_get_FullData);
    if (response?.data) {
      cachedData = response.data;
      console.log("✅ Cache Avis mis à jour");
    } else {
      console.log("⚠️ Aucune donnée Avis reçue lors du refresh");
    }
  } catch (error) {
    console.error("❌ Erreur lors du refresh Avis :", error);
  } finally {
    refreshPromise = null;
  }
  return cachedData || [];
}

export async function FullData() {
  if (cachedData) {
    console.log("⚡ Données Avis servies depuis le CACHE");
    return cachedData;
  }
  if (!refreshPromise) {
    console.log("🚀 Aucun cache Avis → lancement du refresh");
    refreshPromise = refreshData();
  }
  return refreshPromise;
}

/*
export async function refreshData() {
  try {
    const response = await get_wix_services(wixData_url_get_FullData);
    if (response.data) {
      cachedData = response.data;
    }
  } catch (error) {
    console.error("Erreur lors du init_cachedData_avis :", error);
  } finally {
    refreshPromise = null;
  }
  return cachedData || [];
}

export async function FullData() {
  if (cachedData) {
    return cachedData;
  }
  if (!refreshPromise) {
    refreshPromise = await refreshData();
  }
  return refreshPromise;
}
*/

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
