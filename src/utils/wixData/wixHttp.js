import {
  compressed_obj,
  decompressed_obj,
} from "../../utils/compression/compression.js";
//import { get_wix_services,post_wix_services } from '../utils/wixData/wixHttp.js'

export async function get_wix_services(wixUrl, {
  timeout = 15000,
  retries = 2
} = {}) {

  for (let attempt = 0; attempt <= retries; attempt++) {

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(wixUrl, {
        method: "GET",
        signal: controller.signal,
        headers: {
          "Accept": "application/json"
        }
      });

      clearTimeout(timer);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      return decompressed_obj(data);

    } catch (error) {

      clearTimeout(timer);

      if (
        attempt < retries &&
        (error.name === "AbortError" || error.code === "UND_ERR_SOCKET")
      ) {
        continue;
      }

      throw error;
    }
  }
}

/*
export async function get_wix_services(wixUrl) {
  const response = await fetch(wixUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return decompressed_obj(await response.json());
}
*/
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
