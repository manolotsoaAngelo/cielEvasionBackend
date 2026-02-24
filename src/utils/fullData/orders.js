import { get_wix_services } from "../wixData/wixHttp.js";
/*
import { init_cachedData_orders,
  refresh_orders
 } from "../utils/fullData/orders.js";
*/

let cachedData = null;
let refreshPromise = null;

export function init_cachedData_orders() {
  cachedData = null;
  refreshPromise = null;
  return {
    cachedData: cachedData,
    refreshPromise: refreshPromise,
  };
}

export async function refreshData(wixData_url_get_FullData) {
  try {
    console.log("🔄 Refresh des données Orders depuis Wix...");
    const response = await get_wix_services(wixData_url_get_FullData);
    if (response?.data) {
      cachedData = response.data;
      console.log("✅ Cache Orders mis à jour");
    } else {
      console.log("⚠️ Aucune donnée Orders reçue lors du refresh");
    }
  } catch (error) {
    console.error("❌ Erreur lors du refresh Orders :", error);
  } finally {
    refreshPromise = null;
  }
  return cachedData || [];
}

export async function FullData(wixData_url_get_FullData) {
  if (cachedData) {
    console.log("⚡ Données Orders servies depuis le CACHE");
    return cachedData;
  }
  if (!refreshPromise) {
    console.log("🚀 Aucun cache Orders → lancement du refresh");
    refreshPromise = refreshData(wixData_url_get_FullData);
  }
  return refreshPromise;
}

/*
export async function refreshData(wixData_url_get_FullData) {
  try {
    const response = await get_wix_services(wixData_url_get_FullData);
    if (response.data) {
      cachedData = response.data;
    }
  } catch (error) {
    console.error("Erreur lors du init_cachedData_orders :", error);
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
/*
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
