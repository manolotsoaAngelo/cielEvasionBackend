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

//let crypt = crypter('/api/css/get_css_partenaires')
//console.log(crypt)
//console.log(decrypter("aHR0cHM6Ly9jaWVsZXZhc2lvbmJhY2tlbmQub25yZW5kZXIuY29t"))

/*
/// https://ciel-evasion-backend.vercel.app//api/ebillets/getAllEbillets
/// https://ciel-evasion-backend.vercel.app/ : aHR0cHM6Ly9jaWVsLWV2YXNpb24tYmFja2VuZC52ZXJjZWwuYXBwLw==
/// https://cielevasionbackend.onrender.com : aHR0cHM6Ly9jaWVsZXZhc2lvbmJhY2tlbmQub25yZW5kZXIuY29t

/*
    /api/orders/getAllOrders : L2FwaS9vcmRlcnMvZ2V0QWxsT3JkZXJz
    /api/users/getAllUsers : L2FwaS91c2Vycy9nZXRBbGxVc2Vycw==
    /api/users/getUserByEmail : L2FwaS91c2Vycy9nZXRVc2VyQnlFbWFpbA==
    /api/users/getUserById : L2FwaS91c2Vycy9nZXRVc2VyQnlJZA==
    /api/function/runFunction : L2FwaS9mdW5jdGlvbi9ydW5GdW5jdGlvbg==
    /api/members/getAllMembers : L2FwaS9tZW1iZXJzL2dldEFsbE1lbWJlcnM=
    /api/partenaires/getAllpartenaires : L2FwaS9wYXJ0ZW5haXJlcy9nZXRBbGxwYXJ0ZW5haXJlcw==

    CSS 

    /api/css/get_css_partenaires : L2FwaS9jc3MvZ2V0X2Nzc19wYXJ0ZW5haXJlcw==
*/


///
/*
GET ebillet
/// /api/ebillets/getAllEbillets : L2FwaS9lYmlsbGV0cy9nZXRBbGxFYmlsbGV0cw==

POST ebillet

/api/ebillets/get_All_Ebillet_Facture_ByPartenaire : L2FwaS9lYmlsbGV0cy9nZXRfQWxsX0ViaWxsZXRfRmFjdHVyZV9CeVBhcnRlbmFpcmU=

*/
/*
GET reservation
/api/reservation/getAllreservation : L2FwaS9yZXNlcnZhdGlvbi9nZXRBbGxyZXNlcnZhdGlvbg==
POST reservation
/api/reservation/getAllreservation_ContreProposition : L2FwaS9yZXNlcnZhdGlvbi9nZXRBbGxyZXNlcnZhdGlvbl9Db250cmVQcm9wb3NpdGlvbgo=
/api/reservation/get_reservation_ContrePropositionByIdebillet : L2FwaS9yZXNlcnZhdGlvbi9nZXRfcmVzZXJ2YXRpb25fQ29udHJlUHJvcG9zaXRpb25CeUlkZWJpbGxldA==
/api/reservation/get_reservation_ContrePropositionByIdpartenaire : L2FwaS9yZXNlcnZhdGlvbi9nZXRfcmVzZXJ2YXRpb25fQ29udHJlUHJvcG9zaXRpb25CeUlkcGFydGVuYWlyZQ==
/api/reservation/get_all_reservation_byPartenaire : L2FwaS9yZXNlcnZhdGlvbi9nZXRfYWxsX3Jlc2VydmF0aW9uX2J5UGFydGVuYWlyZQo=
/api/reservation/get_all_reservation_enattente : L2FwaS9yZXNlcnZhdGlvbi9nZXRfYWxsX3Jlc2VydmF0aW9uX2VuYXR0ZW50ZQo=
/api/reservation/get_all_reservation_enattenteByIdpartenaire : L2FwaS9yZXNlcnZhdGlvbi9nZXRfYWxsX3Jlc2VydmF0aW9uX2VuYXR0ZW50ZUJ5SWRwYXJ0ZW5haXJlCg==
/api/reservation/get_reservation_enattenteByIdebillet : L2FwaS9yZXNlcnZhdGlvbi9nZXRfcmVzZXJ2YXRpb25fZW5hdHRlbnRlQnlJZGViaWxsZXQ=
/api/reservation/getAllreservation_reserver : L2FwaS9yZXNlcnZhdGlvbi9nZXRBbGxyZXNlcnZhdGlvbl9yZXNlcnZlcgo=
/api/reservation/get_all_reservation_reserverByIdpartenaire : L2FwaS9yZXNlcnZhdGlvbi9nZXRfYWxsX3Jlc2VydmF0aW9uX3Jlc2VydmVyQnlJZHBhcnRlbmFpcmUK
/api/reservation/get_reservation_reserverByIdebillet : L2FwaS9yZXNlcnZhdGlvbi9nZXRfcmVzZXJ2YXRpb25fcmVzZXJ2ZXJCeUlkZWJpbGxldAo=
*/
