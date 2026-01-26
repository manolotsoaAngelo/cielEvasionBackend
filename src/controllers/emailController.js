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
            activity: "Baptême de l'air en ULM",
            formula: "Formule Découverte - 30 minutes",
            date1: "15 février 2026 - 14:30",
            date2: "16 février 2026 - 10:00",
            date3: "17 février 2026 - 15:45",
            beneficiary: "35 ans – 70 kg",
            ticket: "EB-2026-78945",
            phone: "06 12 34 56 78",
            email: "client@example.com",
            amount: "185 €",
            calendarLink: "https://www.ciel-evasion.fr/partenaire"
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