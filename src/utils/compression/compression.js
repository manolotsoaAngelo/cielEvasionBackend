import LZString from "lz-string";

// 1. Table ASCII pré-allouée (0-255) pour éliminer les allocations de chaînes répétitives
const ASCII = new Array(256);
for (let i = 0; i < 256; i++) {
  ASCII[i] = String.fromCharCode(i);
}

// 2. Cache LRU ultra-rapide basé sur Map (O(1)) avec taille maximale bornée
class SimpleLRU {
  constructor(maxSize = 150) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  get(key) {
    const value = this.cache.get(key);
    if (value !== undefined) {
      // Déplacement en fin de liste (récemment utilisé)
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Éviction de l'entrée la plus ancienne (premier élément)
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }

  clear() {
    this.cache.clear();
  }
}

// Caches multi-niveaux :
// - WeakMap pour les références d'objets (accès instantané en 0 ms sans resérialisation JSON)
// - LRU pour les chaînes sérialisées / réponses HTTP
const objectCompressCache = new WeakMap();
const lruCompressCache = new SimpleLRU(150);
const lruDecompressCache = new SimpleLRU(150);

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
  try {
    return fastCompressToUTF16(input);
  } catch (err) {
    return LZString.compressToUTF16(input);
  }
}

export function compressed_obj(data) {
  if (data == null) return "";

  const isObj = typeof data === "object";

  // Niveau 1 : Vérification dans le WeakMap pour les références d'objets (0 ms)
  if (isObj) {
    const cachedByRef = objectCompressCache.get(data);
    if (cachedByRef !== undefined) {
      return cachedByRef;
    }
  }

  // Sérialisation si nécessaire
  const jsonStr = typeof data === "string" ? data : JSON.stringify(data);

  // Niveau 2 : Vérification dans le cache LRU (chaînes déjà compressées)
  const cachedByStr = lruCompressCache.get(jsonStr);
  if (cachedByStr !== undefined) {
    if (isObj) {
      objectCompressCache.set(data, cachedByStr);
    }
    return cachedByStr;
  }

  // Compression via le moteur optimisé
  const compressed = safeCompressToUTF16(jsonStr);

  // Mise en cache
  lruCompressCache.set(jsonStr, compressed);
  if (isObj) {
    objectCompressCache.set(data, compressed);
  }

  return compressed;
}

export function decompressed_obj(compressed_obj) {
  if (compressed_obj == null || compressed_obj === "") return null;
  if (typeof compressed_obj !== "string") return compressed_obj;

  // Niveau 1 : Cache LRU pour les réponses décompressées
  const cached = lruDecompressCache.get(compressed_obj);
  if (cached !== undefined) {
    return cached;
  }

  try {
    const uncompressed = LZString.decompressFromUTF16(compressed_obj);
    const parsed = uncompressed ? JSON.parse(uncompressed) : null;
    if (parsed !== null) {
      lruDecompressCache.set(compressed_obj, parsed);
    }
    return parsed;
  } catch (err) {
    console.error("Erreur dans decompressed_obj :", err);
    return null;
  }
}
