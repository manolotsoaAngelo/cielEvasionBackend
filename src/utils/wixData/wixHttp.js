import {
  compressed_obj,
  decompressed_obj,
} from "../../utils/compression/compression.js";
//import { get_wix_services,post_wix_services } from '../utils/wixData/wixHttp.js'

export async function get_wix_services(wixUrl) {

  const response = await fetch(wixUrl);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return decompressed_obj(await response.json());
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
