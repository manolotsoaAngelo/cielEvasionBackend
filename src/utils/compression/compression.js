import LZString from "lz-string";

/**
 * Cache LRU ultra-léger et haute performance (O(1))
 * pour la compression et décompression d'objets.
 */
class LRUCache {
  constructor(maxSize = 1000, maxEntryBytes = 500 * 1024) {
    this.maxSize = maxSize;
    this.maxEntryBytes = maxEntryBytes;
    this.cache = new Map();
  }

  get(key) {
    const item = this.cache.get(key);
    if (item !== undefined) {
      // Déplacer en tête pour marquer comme récemment utilisé (LRU)
      this.cache.delete(key);
      this.cache.set(key, item);
      return item;
    }
    return undefined;
  }

  set(key, value) {
    // Éviter de saturer la RAM avec des chaînes trop volumineuses (> maxEntryBytes)
    if (typeof key === "string" && key.length > this.maxEntryBytes) return;
    if (typeof value === "string" && value.length > this.maxEntryBytes) return;

    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Éviction de l'entrée la plus ancienne (premier élément dans Map)
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }

  has(key) {
    return this.cache.has(key);
  }

  clear() {
    this.cache.clear();
  }

  get size() {
    return this.cache.size;
  }
}

// Caches bidirectionnels pour mémoriser :
// 1. JSON sérialisé -> Chaîne compressée UTF-16
// 2. Chaîne compressée UTF-16 -> JSON sérialisé
const compressCache = new LRUCache(1000);
const decompressCache = new LRUCache(1000);

/**
 * Compresse un objet ou une donnée quelconque en chaîne UTF-16 LZString avec mise en cache LRU.
 * @param {any} data - Les données à sérialiser et compresser.
 * @returns {string} - La chaîne compressée en UTF-16.
 */
export function compressed_obj(data) {
  if (data === undefined) return "";
  if (data === null) {
    let cached = compressCache.get("null");
    if (!cached) {
      cached = LZString.compressToUTF16("null");
      compressCache.set("null", cached);
      decompressCache.set(cached, "null");
    }
    return cached;
  }

  let jsonStr;
  try {
    jsonStr = typeof data === "string" ? JSON.stringify(data) : JSON.stringify(data);
  } catch (err) {
    console.error("Erreur de sérialisation JSON dans compressed_obj :", err);
    return "";
  }

  // Recherche dans le cache LRU
  const cached = compressCache.get(jsonStr);
  if (cached !== undefined) {
    return cached;
  }

  // Compression via LZString
  const compressed = LZString.compressToUTF16(jsonStr);

  // Mémorisation bidirectionnelle immédiate (décompression instantanée si la donnée revient)
  compressCache.set(jsonStr, compressed);
  decompressCache.set(compressed, jsonStr);

  return compressed;
}

/**
 * Décompresse une chaîne UTF-16 LZString et parse le résultat en objet JavaScript avec cache LRU et tolérance aux pannes.
 * @param {string|any} compressed_data - La chaîne compressée (ou déjà parsée).
 * @returns {any} - L'objet / valeur décompressé(e), ou null en cas d'erreur / entrée vide.
 */
export function decompressed_obj(compressed_data) {
  // Cas limites : null, undefined
  if (compressed_data === null || compressed_data === undefined) {
    return null;
  }

  // Si la donnée n'est pas une chaîne (déjà un objet ou tableau), la retourner directement
  if (typeof compressed_data !== "string") {
    return compressed_data;
  }

  const trimmed = compressed_data.trim();
  if (trimmed.length === 0) {
    return null;
  }

  // Recherche dans le cache de décompression
  let rawJson = decompressCache.get(compressed_data);

  if (rawJson === undefined) {
    try {
      rawJson = LZString.decompressFromUTF16(compressed_data);
    } catch (decompError) {
      console.error("Erreur lors de la décompression UTF-16 :", decompError);
      return null;
    }

    if (!rawJson || rawJson.length === 0) {
      return null;
    }

    // Mémorisation bidirectionnelle
    decompressCache.set(compressed_data, rawJson);
    compressCache.set(rawJson, compressed_data);
  }

  // Parsing JSON sécurisé
  try {
    return JSON.parse(rawJson);
  } catch (jsonError) {
    console.error("Erreur de parsing JSON dans decompressed_obj :", jsonError);
    return rawJson;
  }
}

/**
 * Utilitaires d'administration des caches
 */
export function clear_compression_cache() {
  compressCache.clear();
  decompressCache.clear();
}

export function get_compression_cache_stats() {
  return {
    compressCacheSize: compressCache.size,
    decompressCacheSize: decompressCache.size,
    maxSize: compressCache.maxSize
  };
}

export default {
  compressed_obj,
  decompressed_obj,
  clear_compression_cache,
  get_compression_cache_stats
};
