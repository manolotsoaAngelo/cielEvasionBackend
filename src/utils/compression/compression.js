import LZString from "lz-string";

// Extraction directe des méthodes au niveau du module pour un chargement instantané
// et pour éviter le surcoût de résolution de propriété d'objet à chaque appel
const { compressToUTF16, decompressFromUTF16 } = LZString;

/**
 * Compresse un objet ou une donnée en chaîne UTF-16 compatible LZString Wix.
 * Exécution directe sans cache pour éviter les erreurs de mutation ou de données obsolètes.
 *
 * @param {any} data - Les données à compresser
 * @returns {string} Chaîne compressée UTF-16
 */
export function compressed_obj(data) {
  if (data === undefined) return "";
  if (data === null) return compressToUTF16("null");

  try {
    const jsonStr = JSON.stringify(data);
    if (!jsonStr) return "";
    return compressToUTF16(jsonStr);
  } catch (err) {
    console.error("Erreur dans compressed_obj :", err);
    return "";
  }
}

/**
 * Décompresse une chaîne UTF-16 et parse le JSON résultant.
 * Traitement direct et sécurisé sans cache, avec détection de type et gestion d'erreurs.
 *
 * @param {string|any} compressedData - Donnée compressée ou déjà parsée
 * @returns {any} Données décompressées et parsées
 */
export function decompressed_obj(compressedData) {
  // 1. Évite tout calcul si l'entrée est vide ou nulle
  if (compressedData == null || compressedData === "") {
    return null;
  }

  // 2. Si la donnée a déjà été désérialisée (ex: objet ou tableau déjà parsé)
  if (typeof compressedData !== "string") {
    return compressedData;
  }

  try {
    // 3. Décompression UTF-16
    const decompressed = decompressFromUTF16(compressedData);

    // 4. Cas où la décompression renvoie null/vide (ex: donnée envoyée en clair ou JSON non compressé)
    if (!decompressed) {
      try {
        return JSON.parse(compressedData);
      } catch {
        return compressedData;
      }
    }

    // 5. Désérialisation JSON
    try {
      return JSON.parse(decompressed);
    } catch {
      // Si le contenu décompressé est une chaîne brute (ex: HTML/CSS non JSON)
      return decompressed;
    }
  } catch (err) {
    console.error("Erreur dans decompressed_obj :", err);
    try {
      return JSON.parse(compressedData);
    } catch {
      return null;
    }
  }
}

/*
import { services_post, services_get } from 'backend/modules/server/server'
//import { compressed_obj, decompressed_obj } from 'backend/modules/fonctionnalites/information/compression'
export async function compressed_obj(data) {
    if (data) {
        return await services_post("L2FwaS9mdW5jdGlvbi9ydW5GdW5jdGlvbg==", { typeFunction: "compressed_obj", valeur: data })
    }
}
export async function decompressed_obj(data) {
    if (data) {
        return await services_post("L2FwaS9mdW5jdGlvbi9ydW5GdW5jdGlvbg==", { typeFunction: "decompressed_obj", valeur: data })
    }
}
*/