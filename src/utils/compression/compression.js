import LZString from "lz-string";

// 1. Table ASCII pré-allouée (0-255) pour éliminer les allocations de chaînes répétitives
const ASCII = new Array(256);
for (let i = 0; i < 256; i++) {
  ASCII[i] = String.fromCharCode(i);
}

// 2. Cache LRU ultra-rapide basé sur Map (O(1)) avec vérifications strictes et taille maximale bornée
class SimpleLRU {
  /**
   * @param {number} maxSize Nombre maximum d'entrées (défaut: 150)
   * @param {number} maxEntryLength Taille maximale en caractères d'une entrée mise en cache (défaut: 2 Mo)
   */
  constructor(maxSize = 150, maxEntryLength = 2 * 1024 * 1024) {
    this.maxSize = Number.isInteger(maxSize) && maxSize > 0 ? maxSize : 150;
    this.maxEntryLength = Number.isInteger(maxEntryLength) && maxEntryLength > 0 ? maxEntryLength : 2097152;
    this.cache = new Map();
  }

  get(key) {
    // Vérification stricte du type et du contenu de la clé
    if (typeof key !== "string" || key.length === 0) {
      return undefined;
    }

    if (!this.cache.has(key)) {
      return undefined;
    }

    const value = this.cache.get(key);
    // Vérification stricte de l'intégrité de la valeur extraite
    if (value === undefined || value === null) {
      this.cache.delete(key);
      return undefined;
    }

    // Déplacement en fin de liste (récemment utilisé pour O(1) LRU)
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key, value) {
    // Vérification stricte de la clé et de la valeur
    if (typeof key !== "string" || key.length === 0) {
      return false;
    }
    if (value === undefined || value === null) {
      return false;
    }

    // Protection mémoire : ne pas cacher des chaînes anormalement volumineuses
    if (key.length > this.maxEntryLength || (typeof value === "string" && value.length > this.maxEntryLength)) {
      return false;
    }

    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Éviction de l'entrée la plus ancienne (premier élément de l'itérateur Map)
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, value);
    return true;
  }

  has(key) {
    if (typeof key !== "string" || key.length === 0) {
      return false;
    }
    return this.cache.has(key);
  }

  delete(key) {
    if (typeof key !== "string" || key.length === 0) {
      return false;
    }
    return this.cache.delete(key);
  }

  get size() {
    return this.cache.size;
  }

  clear() {
    this.cache.clear();
  }
}

// Caches multi-niveaux :
// - WeakMap pour les références d'objets (avec détection de mutation et réinitialisation complète)
// - LRU pour les chaînes sérialisées / réponses HTTP
let objectCompressCache = new WeakMap();
const lruCompressCache = new SimpleLRU(150);
const lruDecompressCache = new SimpleLRU(150);

export function clear_compression_cache() {
  objectCompressCache = new WeakMap();
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
  if (typeof input !== "string" || input.length === 0) return "";
  try {
    const res = fastCompressToUTF16(input);
    if (typeof res === "string" && res.length > 0) {
      return res;
    }
    return LZString.compressToUTF16(input) || "";
  } catch (err) {
    try {
      return LZString.compressToUTF16(input) || "";
    } catch {
      return "";
    }
  }
}

export function compressed_obj(data) {
  // 1. Validation stricte des entrées
  if (data === null || data === undefined) {
    return "";
  }

  // Si c'est déjà une chaîne vide
  if (typeof data === "string" && data.length === 0) {
    return "";
  }

  const isObject = typeof data === "object" || typeof data === "function";

  // Niveau 1 : Vérification stricte dans le WeakMap pour les références d'objets (0 ms)
  if (isObject) {
    try {
      const cachedEntry = objectCompressCache.get(data);
      if (cachedEntry && typeof cachedEntry.compressed === "string" && cachedEntry.compressed.length > 0) {
        // Objet garanti immuable
        if (cachedEntry.isFrozen) {
          return cachedEntry.compressed;
        }
        // Vérification stricte anti-mutation pour objets mutables
        const isArr = Array.isArray(data);
        if (isArr && cachedEntry.isArray) {
          if (data.length === cachedEntry.arrayLength) {
            return cachedEntry.compressed;
          }
        } else if (!isArr && !cachedEntry.isArray) {
          if (Object.keys(data).length === cachedEntry.keyCount) {
            return cachedEntry.compressed;
          }
        }
      }
    } catch {
      // Ignorer si data n'est pas supporté comme clé WeakMap
    }
  }

  // Sérialisation sécurisée
  let jsonStr;
  if (typeof data === "string") {
    jsonStr = data;
  } else {
    try {
      jsonStr = JSON.stringify(data);
    } catch (err) {
      console.error("Erreur de sérialisation JSON dans compressed_obj :", err);
      return "";
    }
  }

  if (typeof jsonStr !== "string" || jsonStr.length === 0) {
    return "";
  }

  // Niveau 2 : Vérification stricte dans le cache LRU (chaînes déjà compressées)
  const cachedByStr = lruCompressCache.get(jsonStr);
  if (typeof cachedByStr === "string" && cachedByStr.length > 0) {
    if (isObject) {
      try {
        const isArr = Array.isArray(data);
        objectCompressCache.set(data, {
          compressed: cachedByStr,
          isFrozen: Object.isFrozen(data),
          isArray: isArr,
          arrayLength: isArr ? data.length : 0,
          keyCount: isArr ? 0 : Object.keys(data).length,
        });
      } catch {}
    }
    return cachedByStr;
  }

  // Compression via le moteur optimisé avec repli sécurisé
  const compressed = safeCompressToUTF16(jsonStr);

  if (typeof compressed !== "string" || compressed.length === 0) {
    return "";
  }

  // Mise en cache avec validation stricte
  lruCompressCache.set(jsonStr, compressed);
  if (isObject) {
    try {
      const isArr = Array.isArray(data);
      objectCompressCache.set(data, {
        compressed,
        isFrozen: Object.isFrozen(data),
        isArray: isArr,
        arrayLength: isArr ? data.length : 0,
        keyCount: isArr ? 0 : Object.keys(data).length,
      });
    } catch {}
  }

  return compressed;
}

export function decompressed_obj(compressed_obj) {
  // 1. Validation stricte des entrées
  if (compressed_obj === null || compressed_obj === undefined || compressed_obj === "") {
    return null;
  }

  // Si ce n'est pas une chaîne (déjà un objet décompressé), renvoyer tel quel
  if (typeof compressed_obj !== "string") {
    return compressed_obj;
  }

  const trimmed = compressed_obj.trim();
  if (trimmed.length === 0) {
    return null;
  }

  // Niveau 1 : Vérification stricte dans le cache LRU de décompression
  const cachedUncompressed = lruDecompressCache.get(compressed_obj);
  if (typeof cachedUncompressed === "string" && cachedUncompressed.length > 0) {
    try {
      return JSON.parse(cachedUncompressed);
    } catch {
      return cachedUncompressed;
    }
  }

  // Décompression avec gestion stricte des erreurs
  try {
    const uncompressed = LZString.decompressFromUTF16(compressed_obj);

    // Si la décompression a échoué
    if (uncompressed === null || uncompressed === undefined) {
      // Repli de secours : la chaîne reçue était-elle déjà du JSON brut non compressé ?
      if (
        (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
        (trimmed.startsWith("[") && trimmed.endsWith("]"))
      ) {
        try {
          return JSON.parse(compressed_obj);
        } catch {
          return null;
        }
      }
      return null;
    }

    if (typeof uncompressed !== "string") {
      return null;
    }

    if (uncompressed.length === 0) {
      return "";
    }

    // Mise en cache stricte de la chaîne décompressée (immuable, évite les mutations de références)
    lruDecompressCache.set(compressed_obj, uncompressed);

    // Parsing JSON avec repli transparent sur la chaîne brute (HTML, CSS, texte brut)
    try {
      return JSON.parse(uncompressed);
    } catch {
      return uncompressed;
    }
  } catch (err) {
    console.error("Erreur dans decompressed_obj :", err);
    return null;
  }
}
