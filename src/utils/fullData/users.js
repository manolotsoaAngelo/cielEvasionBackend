import { get_wix_services } from "../wixData/wixHttp.js";
/*
import { init_cachedData_users,
refresh_partenaire
 } from "../utils/fullData/users.js";
*/

let cachedData = null;
let refreshPromise = null;

export function init_cachedData_users() {
  cachedData = null;
  refreshPromise = null;
  return {
    cachedData: cachedData,
    refreshPromise: refreshPromise,
  };
}

export async function refreshData(WIX_DATA_URL) {
  try {
    refreshPromise = true
    console.log("🔄 Rafraîchissement des données Users depuis Wix...");
    const response = await get_wix_services(WIX_DATA_URL);
    refreshPromise = null;
    if (response?.data) {
      cachedData = response.data;
      console.log("✅ Cache Users mis à jour avec succès");
      return cachedData;
    } else {
      console.log("⚠️ Aucune donnée Users reçue lors du rafraîchissement");
      return cachedData || [];
    }
  } catch (error) {
    console.error("❌ Erreur lors du rafraîchissement Users :", error);
    return cachedData = (await get_wix_services(WIX_DATA_URL)).data
  } finally {
    refreshPromise = null;
  }
}

export async function FullData(WIX_DATA_URL) {
  if (cachedData) {
    console.log("⚡ Données Users servies depuis le cache");
    return cachedData;
  }
  if (refreshPromise) {
    console.log("⏳ Rafraîchissement en cours, attente des données...");
    return refreshPromise;
  }
  console.log("🚀 Aucun cache Users → lancement du rafraîchissement");
  refreshPromise = refreshData(WIX_DATA_URL);
  return refreshPromise;
}

/*
export async function refreshData(wixData_url_get_FullData) {
  try {
    console.log("🔄 Refresh des données Users depuis Wix...");
    const response = await get_wix_services(wixData_url_get_FullData);
    if (response?.data) {
      cachedData = response.data;
      console.log("✅ Cache Users mis à jour");
    } else {
      console.log("⚠️ Aucune donnée Users reçue lors du refresh");
    }
  } catch (error) {
    console.error("❌ Erreur lors du refresh Users :", error);
  } finally {
    refreshPromise = null;
  }
  return cachedData || [];
}

export async function FullData(wixData_url_get_FullData) {
  if (cachedData) {
    console.log("⚡ Données Users servies depuis le CACHE");
    return cachedData;
  }
  if (!refreshPromise) {
    console.log("🚀 Aucun cache Users → lancement du refresh");
    refreshPromise = refreshData(wixData_url_get_FullData);
  }
  return refreshPromise;
}
*/
/*
export async function refreshData(wixData_url_get_FullData) {
  try {
    const response = await get_wix_services(wixData_url_get_FullData);
    if (response.data) {
      cachedData = response.data;
    }
  } catch (error) {
    console.error("Erreur lors du init_cachedData_users :", error);
  } finally {
    refreshPromise = null;
  }
  return cachedData || [];
}

export async function FullData(wixData_url_get_FullData) {
  if (cachedData) {
    return cachedData;
  }
  if (!refreshPromise) {
    refreshPromise = await refreshData(wixData_url_get_FullData);
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
