import {
  compressed_obj,
  decompressed_obj,
} from "../../utils/compression/compression.js";

/**
 * Retry simple avec délai exponentiel
 */
async function retry(fn, maxAttempts = 3) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn();
    } catch (error) {
      // Ne réessayer que pour certaines erreurs
      const isRetryable =
        error.message?.includes('terminated') ||
        error.message?.includes('UND_ERR_SOCKET') ||
        error.code === 'ECONNRESET' ||
        error.code === 'ETIMEDOUT' ||
        error.response?.status >= 500;

      if (!isRetryable || i === maxAttempts - 1) {
        throw error;
      }

      // Délai progressif : 1s, 2s, 4s...
      const delay = Math.pow(2, i) * 1000;
      console.warn(`Retry ${i + 1}/${maxAttempts} dans ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

export async function get_wix_services(wixUrl) {
  return retry(async () => {
    const response = await fetch(wixUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}`);
      error.response = response;
      throw error;
    }

    return decompressed_obj(await response.json());
  });
}

export async function post_wix_services(wixUrl, data) {
  return retry(async () => {
    const response = await fetch(wixUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Encoding": "gzip",
      },
      body: compressed_obj(data),
    });

    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}`);
      error.response = response;
      throw error;
    }

    return decompressed_obj(await response.json());
  });
}

/*
import {
  compressed_obj,
  decompressed_obj,
} from "../../utils/compression/compression.js";
//import { get_wix_services,post_wix_services } from '../utils/wixData/wixHttp.js'

export async function get_wix_services(wixUrl) {
  const response = await fetch(wixUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return decompressed_obj(await response.json());
}

export async function post_wix_services(wixUrl, data) {
  const response = await fetch(wixUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept-Encoding": "gzip",
    },
    body: compressed_obj(data),
  });
  return decompressed_obj(await response.json());
}
*/