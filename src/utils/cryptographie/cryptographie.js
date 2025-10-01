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

let crypt = crypter('/api/reservation/getAllreservation')
console.log(crypt)
//console.log(decrypter(crypt))

/*

/// https://ciel-evasion-backend.vercel.app/ : aHR0cHM6Ly9jaWVsLWV2YXNpb24tYmFja2VuZC52ZXJjZWwuYXBwLw==
/// /api/ebillets/getAllEbillets : L2FwaS9lYmlsbGV0cy9nZXRBbGxFYmlsbGV0cw==
/// /api/orders/getAllOrders : L2FwaS9vcmRlcnMvZ2V0QWxsT3JkZXJz
/// /api/reservation/getAllreservation : L2FwaS9yZXNlcnZhdGlvbi9nZXRBbGxyZXNlcnZhdGlvbg==
/// /api/function/runFunction : L2FwaS9mdW5jdGlvbi9ydW5GdW5jdGlvbg==

*/