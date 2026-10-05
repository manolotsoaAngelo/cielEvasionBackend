import LZString from "lz-string";

// 1. Table ASCII pré-allouée (0-255) pour éliminer les allocations de chaînes répétitives
const ASCII = new Array(256);
for (let i = 0; i < 256; i++) {
  ASCII[i] = String.fromCharCode(i);
}

// 2. Cache LRU ultra-rapide basé sur Map (O(1)) avec TTL (Time-To-Live) anti-obsolescence
class SimpleLRU {
  constructor(maxSize = 150, ttlMs = 1000 * 60) {
    this.maxSize = maxSize;
    this.ttlMs = ttlMs; // Expiration automatique par défaut (60 secondes)
    this.cache = new Map();
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    // Invalidation stricte si la donnée a expiré (évite de renvoyer des données obsolètes)
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return undefined;
    }

    // Déplacement en fin de liste (récemment utilisé)
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.value;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Éviction de l'entrée la plus ancienne (premier élément)
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, {
      value,
      expiry: Date.now() + this.ttlMs,
    });
  }

  delete(key) {
    return this.cache.delete(key);
  }

  has(key) {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  clear() {
    this.cache.clear();
  }
}

// Caches bornés avec TTL :
// - Cache LRU pour les chaînes JSON sérialisées -> chaînes compressées
// - Cache LRU pour les chaînes compressées -> chaînes JSON décompressées
// NOTE ANTI-OBSOLESCENCE CRITIQUE :
// - AUCUN cache par référence d'objet (suppression totale de WeakMap) pour garantir
//   que toute mutation d'objet soit immédiatement prise en compte.
// - AUCUN cache d'instance d'objet décompressé pour éviter la contamination et les mutations partagées.
const lruCompressCache = new SimpleLRU(150, 1000 * 60);
const lruDecompressCache = new SimpleLRU(150, 1000 * 60);

export function clear_compression_cache() {
  lruCompressCache.clear();
  lruDecompressCache.clear();
}

/**
 * Moteur de compression UTF-16 optimisé pour V8 :
 * - Dictionnaire null-prototype (Object.create(null)) évitant hasOwnProperty
 * - Élimination de l'opérateur 'delete' (préserve l'optimisation monomorphe de V8)
 * - Inlining du calcul de caractères
 * - Table ASCII pré-générée évitant charAt()
 */
function fastCompressToUTF16(uncompressed) {
  if (uncompressed == null || uncompressed === "") return "";

  const len = uncompressed.length;
  const context_dictionary = Object.create(null);
  const context_dictionaryToCreate = Object.create(null);
  let context_c = "";
  let context_wc = "";
  let context_w = "";
  let context_enlargeIn = 2;
  let context_dictSize = 3;
  let context_numBits = 2;
  const context_data = [];
  let context_data_val = 0;
  let context_data_position = 0;

  for (let ii = 0; ii < len; ii++) {
    const code = uncompressed.charCodeAt(ii);
    context_c = code < 256 ? ASCII[code] : uncompressed.charAt(ii);

    if (context_dictionary[context_c] === undefined) {
      context_dictionary[context_c] = context_dictSize++;
      context_dictionaryToCreate[context_c] = true;
    }

    context_wc = context_w + context_c;
    if (context_dictionary[context_wc] !== undefined) {
      context_w = context_wc;
    } else {
      if (context_dictionaryToCreate[context_w] === true) {
        if (context_w.charCodeAt(0) < 256) {
          for (let i = 0; i < context_numBits; i++) {
            context_data_val = (context_data_val << 1);
            if (context_data_position === 14) {
              context_data_position = 0;
              context_data.push(String.fromCharCode(context_data_val + 32));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
          }
          let value = context_w.charCodeAt(0);
          for (let i = 0; i < 8; i++) {
            context_data_val = (context_data_val << 1) | (value & 1);
            if (context_data_position === 14) {
              context_data_position = 0;
              context_data.push(String.fromCharCode(context_data_val + 32));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        } else {
          let value = 1;
          for (let i = 0; i < context_numBits; i++) {
            context_data_val = (context_data_val << 1) | value;
            if (context_data_position === 14) {
              context_data_position = 0;
              context_data.push(String.fromCharCode(context_data_val + 32));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = 0;
          }
          value = context_w.charCodeAt(0);
          for (let i = 0; i < 16; i++) {
            context_data_val = (context_data_val << 1) | (value & 1);
            if (context_data_position === 14) {
              context_data_position = 0;
              context_data.push(String.fromCharCode(context_data_val + 32));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        }
        context_enlargeIn--;
        if (context_enlargeIn === 0) {
          context_enlargeIn = 1 << context_numBits;
          context_numBits++;
        }
        context_dictionaryToCreate[context_w] = false;
      } else {
        let value = context_dictionary[context_w];
        for (let i = 0; i < context_numBits; i++) {
          context_data_val = (context_data_val << 1) | (value & 1);
          if (context_data_position === 14) {
            context_data_position = 0;
            context_data.push(String.fromCharCode(context_data_val + 32));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = value >> 1;
        }
      }
      context_enlargeIn--;
      if (context_enlargeIn === 0) {
        context_enlargeIn = 1 << context_numBits;
        context_numBits++;
      }
      context_dictionary[context_wc] = context_dictSize++;
      context_w = String(context_c);
    }
  }

  // Finalisation du dernier mot
  if (context_w !== "") {
    if (context_dictionaryToCreate[context_w] === true) {
      if (context_w.charCodeAt(0) < 256) {
        for (let i = 0; i < context_numBits; i++) {
          context_data_val = (context_data_val << 1);
          if (context_data_position === 14) {
            context_data_position = 0;
            context_data.push(String.fromCharCode(context_data_val + 32));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
        }
        let value = context_w.charCodeAt(0);
        for (let i = 0; i < 8; i++) {
          context_data_val = (context_data_val << 1) | (value & 1);
          if (context_data_position === 14) {
            context_data_position = 0;
            context_data.push(String.fromCharCode(context_data_val + 32));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = value >> 1;
        }
      } else {
        let value = 1;
        for (let i = 0; i < context_numBits; i++) {
          context_data_val = (context_data_val << 1) | value;
          if (context_data_position === 14) {
            context_data_position = 0;
            context_data.push(String.fromCharCode(context_data_val + 32));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = 0;
        }
        value = context_w.charCodeAt(0);
        for (let i = 0; i < 16; i++) {
          context_data_val = (context_data_val << 1) | (value & 1);
          if (context_data_position === 14) {
            context_data_position = 0;
            context_data.push(String.fromCharCode(context_data_val + 32));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = value >> 1;
        }
      }
      context_enlargeIn--;
      if (context_enlargeIn === 0) {
        context_enlargeIn = 1 << context_numBits;
        context_numBits++;
      }
      context_dictionaryToCreate[context_w] = false;
    } else {
      let value = context_dictionary[context_w];
      for (let i = 0; i < context_numBits; i++) {
        context_data_val = (context_data_val << 1) | (value & 1);
        if (context_data_position === 14) {
          context_data_position = 0;
          context_data.push(String.fromCharCode(context_data_val + 32));
          context_data_val = 0;
        } else {
          context_data_position++;
        }
        value = value >> 1;
      }
    }
    context_enlargeIn--;
    if (context_enlargeIn === 0) {
      context_enlargeIn = 1 << context_numBits;
      context_numBits++;
    }
  }

  // Marqueur de fin de flux (valeur 2)
  let value = 2;
  for (let i = 0; i < context_numBits; i++) {
    context_data_val = (context_data_val << 1) | (value & 1);
    if (context_data_position === 14) {
      context_data_position = 0;
      context_data.push(String.fromCharCode(context_data_val + 32));
      context_data_val = 0;
    } else {
      context_data_position++;
    }
    value = value >> 1;
  }

  // Vidage des derniers bits
  while (true) {
    context_data_val = (context_data_val << 1);
    if (context_data_position === 14) {
      context_data.push(String.fromCharCode(context_data_val + 32));
      break;
    } else {
      context_data_position++;
    }
  }

  return context_data.join("") + " ";
}

function safeCompressToUTF16(input) {
  if (!input) return "";
  try {
    const res = fastCompressToUTF16(input);
    if (res && res.length > 0) return res;
    return LZString.compressToUTF16(input);
  } catch (err) {
    return LZString.compressToUTF16(input);
  }
}

export function compressed_obj(data, options = {}) {
  if (data == null) return "";

  const bypass = typeof options === "boolean" ? options : Boolean(options?.bypassCache || options?.noCache || options?.force);

  // Sérialisation stricte et systématique :
  // On ne met JAMAIS en cache l'objet par référence d'objet (WeakMap supprimé),
  // afin d'empêcher tout renvoi de données obsolètes suite à une modification/mutation en mémoire.
  let jsonStr;
  try {
    jsonStr = typeof data === "string" ? data : JSON.stringify(data);
  } catch (err) {
    console.error("Erreur de sérialisation JSON dans compressed_obj :", err);
    return "";
  }

  if (jsonStr === "") return "";

  // Vérification dans le cache LRU (uniquement basé sur la chaîne exacte et avec TTL)
  if (!bypass) {
    const cachedByStr = lruCompressCache.get(jsonStr);
    if (cachedByStr !== undefined) {
      return cachedByStr;
    }
  }

  // Compression via le moteur optimisé
  const compressed = safeCompressToUTF16(jsonStr);

  // Mise en cache de la chaîne compressée
  if (!bypass && compressed) {
    lruCompressCache.set(jsonStr, compressed);
  }

  return compressed;
}

export function decompressed_obj(compressed_obj, options = {}) {
  if (compressed_obj == null || compressed_obj === "") return null;
  if (typeof compressed_obj !== "string") return compressed_obj;

  const bypass = typeof options === "boolean" ? options : Boolean(options?.bypassCache || options?.noCache || options?.force);

  // Niveau 1 : Cache LRU (uniquement pour la chaîne décompressée brute, JAMAIS pour l'instance d'objet)
  if (!bypass) {
    const cachedUncompressed = lruDecompressCache.get(compressed_obj);
    if (cachedUncompressed !== undefined) {
      try {
        // TOUJOURS parser une nouvelle instance d'objet indépendante :
        // Cela élimine tout risque de contamination croisée ou de renvoi de données obsolètes
        // si l'appelant modifie les champs de l'objet en mémoire.
        return JSON.parse(cachedUncompressed);
      } catch {
        lruDecompressCache.delete(compressed_obj);
      }
    }
  }

  try {
    let uncompressed = null;
    try {
      uncompressed = LZString.decompressFromUTF16(compressed_obj);
    } catch {
      uncompressed = null;
    }

    // Si la décompression a échoué ou a retourné null/vide
    if (!uncompressed) {
      // Fallback : vérifier si la chaîne était déjà du JSON brut non compressé
      try {
        return JSON.parse(compressed_obj);
      } catch {
        return null;
      }
    }

    // Parser l'objet à retourner (instance neuve et isolée)
    const parsed = JSON.parse(uncompressed);

    // Mettre en cache la chaîne brute décompressée (string immuable, et JAMAIS l'objet !)
    if (!bypass && uncompressed) {
      lruDecompressCache.set(compressed_obj, uncompressed);
    }

    return parsed;
  } catch (err) {
    console.error("Erreur dans decompressed_obj :", err);
    return null;
  }
}
