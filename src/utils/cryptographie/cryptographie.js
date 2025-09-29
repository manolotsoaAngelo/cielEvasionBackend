//import { crypter, decrypter } from '../utils/cryptographie/cryptographie.js'

export function crypter(message) {
    if (message) {
        return btoa(message);
    }
}

export function decrypter(message) {
    if (message) {
        return atob(message);
    }
}

console.log(crypter('https://ciel-evasion-backend.vercel.app/'))
console.log(decrypter(crypter('message')))

/*

/// https://ciel-evasion-backend.vercel.app/ : aHR0cHM6Ly9jaWVsLWV2YXNpb24tYmFja2VuZC52ZXJjZWwuYXBwLw==
/// /api/ebillets : 
/// /api/reservation/getAllreservation :
/// /api/function/runFunction : 

*/