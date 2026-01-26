import {
  compressed_obj,
  decompressed_obj,
} from "../utils/compression/compression.js";

import EmailService from "../services/email.js";

//console.log(await EbilletsService.getByidArticle("27f91f30-a07d-005f-6b44-894cd81c9b2d"))
//console.log(await EbilletsService.getByRef("E241230-3"))
//console.log(await EbilletsService.getById('6650005f-61b4-497f-8cca-2e8b08299fe3'))
//console.log(await EbilletsService.getAll())
//console.log(await EbilletsService.getAllEbilletByPartenaire("15d9204a-b1d1-4288-8e5e-24e0fde1b8d3"))
//console.log(await EbilletsService.getAllEbilletFactureByPartenaire("15d9204a-b1d1-4288-8e5e-24e0fde1b8d3"))
//console.log(await EbilletsService.getAllEbilletFacture())
/*
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

console.log(await EmailService.sendEmailDispo(emailData))
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