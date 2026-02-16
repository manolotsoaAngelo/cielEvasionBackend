import LZString from "lz-string";
//import { compressed_obj, decompressed_obj } from '../utils/compression/compression.js'

export function compressed_obj(data) {
    return LZString.compressToUTF16(JSON.stringify(data));
}

export function decompressed_obj(compressed_obj) {
    return JSON.parse(LZString.decompressFromUTF16(compressed_obj));
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
