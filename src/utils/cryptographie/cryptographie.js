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

//let crypt = crypter('/api/partenaires/get_reservation_ContrePropositionByIdebillet')
//console.log(crypt)
//console.log(decrypter("aHR0cHM6Ly9jaWVsZXZhc2lvbmJhY2tlbmQub25yZW5kZXIuY29t"))

/*

/// https://ciel-evasion-backend.vercel.app//api/ebillets/getAllEbillets

/// https://ciel-evasion-backend.vercel.app/ : aHR0cHM6Ly9jaWVsLWV2YXNpb24tYmFja2VuZC52ZXJjZWwuYXBwLw==
/// https://cielevasionbackend.onrender.com : aHR0cHM6Ly9jaWVsZXZhc2lvbmJhY2tlbmQub25yZW5kZXIuY29t


/// /api/ebillets/getAllEbillets : L2FwaS9lYmlsbGV0cy9nZXRBbGxFYmlsbGV0cw==
/// /api/orders/getAllOrders : L2FwaS9vcmRlcnMvZ2V0QWxsT3JkZXJz
/// /api/reservation/getAllreservation : L2FwaS9yZXNlcnZhdGlvbi9nZXRBbGxyZXNlcnZhdGlvbg==
/*
/api/partenaires/get_reservation_ContrePropositionByIdebillet : L2FwaS9wYXJ0ZW5haXJlcy9nZXRfcmVzZXJ2YXRpb25fQ29udHJlUHJvcG9zaXRpb25CeUlkZWJpbGxldA==
/api/partenaires/get_reservation_ContrePropositionByIdpartenaire : L2FwaS9wYXJ0ZW5haXJlcy9nZXRfcmVzZXJ2YXRpb25fQ29udHJlUHJvcG9zaXRpb25CeUlkcGFydGVuYWlyZQ==
*/
/// /api/function/runFunction : L2FwaS9mdW5jdGlvbi9ydW5GdW5jdGlvbg==
/// /api/members/getAllMembers : L2FwaS9tZW1iZXJzL2dldEFsbE1lbWJlcnM=
/// /api/partenaires/getAllpartenaires : L2FwaS9wYXJ0ZW5haXJlcy9nZXRBbGxwYXJ0ZW5haXJlcw==