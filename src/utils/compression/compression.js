import LZString from "lz-string";
//import { compressed_obj, decompressed_obj } from 'backend/modules/fonctionnalites/information/compression'

export function compressed_obj(data) {
    return LZString.compressToUTF16(JSON.stringify(data));
}

export function decompressed_obj(compressed_obj) {
    return JSON.parse(LZString.decompressFromUTF16(compressed_obj));
}