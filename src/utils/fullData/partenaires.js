import { get_wix_services } from "../wixData/wixHttp.js";
/*
import { init_cachedData_partenaire,
  refresh_partenaire
 } from "../utils/fullData/partenaires.js";
*/

let collection_name = "Partenaire_test";
let wixData_url_get_FullData =
  "https://ciel-evasion.fr/_functions/WixData/" + collection_name + "/";

let cachedData = null;
let refreshPromise = null;

export function init_cachedData_partenaire() {
  cachedData = null;
  refreshPromise = null;
  return {
    cachedData: cachedData,
    refreshPromise: refreshPromise,
  };
}
export async function refresh_partenaire() {
  await refreshData();
}

const WIX_DATA_URL = wixData_url_get_FullData

export async function refreshData() {
  try {
    refreshPromise = true
    console.log("🔄 Rafraîchissement des données Avis depuis Wix...");
    const response = await get_wix_services(WIX_DATA_URL);
    
    if (response?.data) {
      cachedData = response.data;
      console.log("✅ Cache Avis mis à jour avec succès");
      return cachedData;
    } else {
      console.log("⚠️ Aucune donnée Avis reçue lors du rafraîchissement");
      return cachedData || [];
    }
  } catch (error) {
    console.error("❌ Erreur lors du rafraîchissement Avis :", error);
    return cachedData = (await get_wix_services(WIX_DATA_URL)).data
  } finally {
    refreshPromise = null;
  }
}

export async function FullData() {
  if (cachedData) {
    console.log("⚡ Données Avis servies depuis le cache");
    return cachedData;
  }
  if (refreshPromise) {
    console.log("⏳ Rafraîchissement en cours, attente des données...");
    return refreshPromise;
  }
  console.log("🚀 Aucun cache Avis → lancement du rafraîchissement");
  refreshPromise = refreshData();
  return refreshPromise;
}

/*
export async function refreshData() {
  try {
    console.log("🔄 Refresh des données Partenaires depuis Wix...");
    const response = await get_wix_services(wixData_url_get_FullData);
    if (response?.data) {
      cachedData = response.data;
      console.log("✅ Cache Partenaires mis à jour");
    } else {
      console.log("⚠️ Aucune donnée Partenaires reçue lors du refresh");
    }
  } catch (error) {
    console.error("❌ Erreur lors du refresh Partenaires :", error);
  } finally {
    refreshPromise = null;
  }
  return cachedData || [];
}

export async function FullData() {
  if (cachedData) {
    console.log("⚡ Données Partenaires servies depuis le CACHE");
    return cachedData;
  }
  if (!refreshPromise) {
    console.log("🚀 Aucun cache Partenaires → lancement du refresh");
    refreshPromise = refreshData();
  }
  return refreshPromise;
}
*/

/*
export async function refreshData() {
  try {
    const response = await get_wix_services(wixData_url_get_FullData);
    if (response.data) {
      cachedData = response.data;
    }
  } catch (error) {
    console.error("Erreur lors du init_cachedData_partenaire :", error);
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
