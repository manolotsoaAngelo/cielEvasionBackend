import {
  compressed_obj,
  decompressed_obj,
} from "../utils/compression/compression.js";


import EmailService from "../services/email.js";
import UsersService from "../services/users.js";
/*
let id_destinataire = (await UsersService.getByEmail("manolotsoa.randriambeloniaina@gmail.com"))._id;
const emailData = {
  partenaire: "test",
  Articles: "test",
  TitreActivite: "test",
  variable_lieu: "test",
  Lieu: "Aérodrome de Chambéry - Savoie",
  Options: "test",
  Date1: "test",
  Horaire1: "test",
  Date2: "test",
  Horaire2: "test",
  Date3: "test",
  Horaire3: "test",
  Prenom: "test",
  Nom: "test",
  Age: "test",
  Poids: "test",
  Taille: "test",
  ebillet: "test",
  tel: "test",
  email: "test",
  prix: "test"
};

let data = { data: emailData, destinataire: id_destinataire }
const start = Date.now();
console.log(await EmailService.email_Tib2QVP(data))
console.log(await EmailService.email_Tiam3wq(data))
console.log(await EmailService.email_Tj8PgM(data))
const end = Date.now();
console.log(`email_ a pris ${(end - start) / 1000} s`);
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