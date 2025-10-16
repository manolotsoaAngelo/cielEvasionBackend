/*
import { fetch } from 'wix-fetch';
import LZString from "lz-string";
let backend = "aHR0cHM6Ly9jaWVsLWV2YXNpb24tYmFja2VuZC52ZXJjZWwuYXBwLw=="
//import { services_post,services_get } from 'backend/modules/server/server'

export async function services_post(route, data) {
    const start = Date.now();
    let result = await fetch(`${await atob(backend)}${await atob(route)}`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            data: LZString.compressToUTF16(JSON.stringify(data))
        })
    }).then(res => res.json())
    const end = Date.now();
    console.log(`services_post a pris ${(end - start)/1000} s`);
    return JSON.parse(LZString.decompressFromUTF16(result))
}

export async function services_get(route) {
    const start = Date.now();
    let result = await fetch(`${await atob(backend)}${await atob(route)}`, {
        method: "get",
        headers: { "Content-Type": "application/json" }
    }).then(res => res.json());
    const end = Date.now();
    console.log(`services_get a pris ${(end - start)/1000} s`);
    return JSON.parse(LZString.decompressFromUTF16(result))
}
*/