import {
  compressed_obj,
  decompressed_obj,
} from "../utils/compression/compression.js";

import EmailService from "../services/email.js";
import UsersService from "../services/users.js";

/*
let id_destinataire = (await UsersService.getByEmail("manolotsoa.randriambeloniaina@gmail.com"))._id;
const emailData = {
    partenaire: "Aventure Sensation",
    Articles: "Saut en parachute tandem",
    TitreActivite: "Formule Découverte + Photos HD",
    variable_lieu: "AltitudeMax",
    Lieu: "Aérodrome de Chambéry - Savoie",
    Options: null,
    Date1: "15 juin 2024",
    Horaire1: "09h30",
    Date2: "16 juin 2024",
    Horaire2: "11h00",
    Date3: "17 juin 2024",
    Horaire3: "14h00",
    Prenom: "Marie",
    Nom: "Dubois",
    Age: "32",
    Poids: "65",
    Taille: "172",
    ebillet: "AVS-2024-05678",
    tel: "+33 6 12 34 56 78",
    email: "marie.dubois@example.com",
    prix: "289"
};

let data = { data:emailData, destinataire: id_destinataire}

console.log(await EmailService.email_Tib2QVP(data))

*/

/*
export async function get_All_Ebillet_Facture(req, res) {
  let all_ebillet_data = await EbilletsService.getAllEbilletFacture()
  res.json(compressed_obj(all_ebillet_data));
}

export async function get_All_Ebillet_Facture_ByPartenaire(req, res) {
  let value = post(req, res);
  let result = await EbilletsService.getAllEbilletFactureByPartenaire(value._id);
  res.status(201).json(compressed_obj(result));
}

export async function get_all_ebillet(req, res) {
  let all_ebillet_data = await EbilletsService.getAll();
  res.json(compressed_obj(all_ebillet_data));
}

function post(req, res) {
  const { data } = req.body;
  if (!data) return res.status(400).json({ error: "données requis" });
  return decompressed_obj(data);
}
*/