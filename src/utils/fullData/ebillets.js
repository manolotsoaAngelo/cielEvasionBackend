import { get_wix_services } from "../wixData/wixHttp.js";

let cachedData = null;
let refreshPromise = null;

const WIX_DATA_URL = "https://ciel-evasion.fr/_functions/WixData/all_ebillet/";

// 1. Fonction unique pour récupérer les données (sécurisée)
async function fetchFromWix() {
  try {
    console.log("🔄 Récupération des données E-billet depuis Wix...");
    const response = await get_wix_services(WIX_DATA_URL);

    if (response?.data) {
      cachedData = response.data;
      console.log("✅ Cache E-billet mis à jour avec succès");
    } else {
      console.log("⚠️ Aucune donnée E-billet reçue, conservation de l'ancien cache si existant");
      // On garde l'ancien cache s'il existe, sinon on met un tableau vide
      cachedData = cachedData || [];
    }
    return cachedData;
  } catch (error) {
    console.error("❌ Erreur lors du rafraîchissement E-billet :", error);
    // En cas d'erreur, on retourne le cache existant ou un tableau vide pour éviter de tout bloquer
    return cachedData || [];
  } finally {
    // Crucial : on libère la promesse seulement quand l'appel est 100% terminé
    refreshPromise = null;
  }
}

// 2. Fonction principale avec option de forçage du cache
export async function FullData(forceRefresh = false) {
  // Si on force le rafraîchissement, on vide le cache local
  if (forceRefresh) {
    console.log("🧹 Vidage du cache demandé.");
    cachedData = null;
  }

  // S'il y a déjà des données et qu'on ne force pas, on les renvoie
  if (cachedData && !forceRefresh) {
    console.log("⚡ Données E-billet servies depuis le cache");
    return cachedData;
  }

  // Si une requête est DÉJÀ en cours vers Wix, on s'abonne à cette même requête
  // Cela empêche d'envoyer 5 requêtes Wix si 5 utilisateurs se connectent en même temps
  if (refreshPromise) {
    console.log("⏳ Requête déjà en cours, attente de la résolution...");
    return refreshPromise;
  }

  // S'il n'y a ni cache ni requête en cours, on lance la récupération
  console.log("🚀 Lancement d'un nouveau rafraîchissement E-billet");
  refreshPromise = fetchFromWix();

  return refreshPromise;
}

// 3. Rétrocompatibilité et exposition du rafraîchissement
export async function refreshData() {
  // Appelle simplement FullData en forçant le rafraîchissement
  return FullData(true);
}

export function init_cachedData_ebillet() {
  // Pour éviter de casser les imports de vos autres fichiers
  cachedData = null;
  // Ne mettez PAS refreshPromise à null ici, sinon vous cassez les requêtes en vol !
  return {
    cachedData: cachedData,
    refreshPromise: refreshPromise,
  };
}

/*
import { get_wix_services } from "../wixData/wixHttp.js";

import { init_cachedData_ebillet,
  refresh_ebillet
 } from "../utils/fullData/ebillets.js";


let cachedData = null;
let refreshPromise = null;

let collection_name = "Reports";
let wixData_url_get_FullData =
  "https://ciel-evasion.fr/_functions/WixData/" + collection_name + "/";

export function init_cachedData_ebillet() {
  cachedData = null;
  refreshPromise = null;
  return {
    cachedData: cachedData,
    refreshPromise: refreshPromise,
  };
}

const WIX_DATA_URL = "https://ciel-evasion.fr/_functions/WixData/all_ebillet/"

export async function refreshData() {
  try {
    console.log("🔄 Rafraîchissement des données E-billet depuis Wix...");
    const response = await get_wix_services(WIX_DATA_URL);
    
    if (response?.data) {
      cachedData = response.data;
      console.log("✅ Cache E-billet mis à jour avec succès");
      return cachedData;
    } else {
      console.log("⚠️ Aucune donnée E-billet reçue lors du rafraîchissement");
      return cachedData || [];
    }
  } catch (error) {
    console.error("❌ Erreur lors du rafraîchissement E-billet :", error);
    return cachedData = (await get_wix_services(WIX_DATA_URL)).data
  } finally {
    refreshPromise = null;
  }
}

export async function FullData() {
  if (cachedData) {
    console.log("⚡ Données E-billet servies depuis le cache");
    return cachedData;
  }
  
  if (refreshPromise) {
    console.log("⏳ Rafraîchissement en cours, attente des données...");
    return refreshPromise;
  }
  
  console.log("🚀 Aucun cache E-billet → lancement du rafraîchissement");
  refreshPromise = refreshData();
  return refreshPromise;
}

*/

/*
export async function refreshData() {
  try {
    console.log("🔄 Refresh des données E-billet depuis Wix...");
    const response = await get_wix_services(wixData_url_get_FullData);
    if (response?.data) {
      cachedData = response.data;
      console.log("✅ Cache E-billet mis à jour");
    } else {
      console.log("⚠️ Aucune donnée E-billet reçue lors du refresh");
    }
  } catch (error) {
    console.error("❌ Erreur lors du refresh E-billet :", error);
  } finally {
    refreshPromise = null;
  }
  return cachedData || [];
}

export async function FullData() {
  if (cachedData) {
    console.log("⚡ Données E-billet servies depuis le CACHE");
    return cachedData;
  }
  if (!refreshPromise) {
    console.log("🚀 Aucun cache E-billet → lancement du refresh");
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
    console.error("Erreur lors du init_cachedData_ebillet :", error);
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
