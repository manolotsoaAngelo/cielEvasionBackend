/*
import { tri_reportByASC_ref,
tri_ebilletByASC_ref,
tri_ebilletByDate,
tri_ebilletByDEC_Date_Byrdv,
create_order_new
} from '../utils/crud/function.js';
*/

import EbilletsService from "../services/ebillets.js";
import UsersService from "../services/users.js";
import OrdersService from "../services/orders.js";
import PartenairesService from "../services/partenaires.js";

export function tri_ebilletByDEC_Date_Byrdv(array_result) {
    return [...array_result].sort((a, b) => {
        const dateA = new Date(a.rdv).getTime();
        const dateB = new Date(b.rdv).getTime();
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;
        return 0;
    });
}

export function tri_ebilletByASC_Date(array_result) {
    return [...array_result].sort((a, b) => {
        const dateA = new Date(a.datePriseRdvClient).getTime();
        const dateB = new Date(b.datePriseRdvClient).getTime();
        if (dateA > dateB) return -1;
        if (dateA < dateB) return 1;
        return 0;
    });
}

export function tri_ebilletByASC_ref(array_result) {
    array_result.sort((a, b) => {
        if (a.ref < b.ref) return -1;
        if (a.ref > b.ref) return 1;
        return 0;
    });
    return array_result
}

export function tri_reportByASC_ref(result) {
    let array_result = []
    let seen = new Set();
    for (let item of result) {
        let array_ref = [];
        let [prefixA] = item.ref.split("-");
        for (let itemB of result) {
            let [prefixB] = itemB.ref.split("-");
            if (prefixA === prefixB && !array_ref.includes(itemB)) {
                array_ref.push(itemB);
            }
        }
        array_ref.sort((a, b) => a.ref.localeCompare(b.ref));
        if (!seen.has(prefixA)) {
            array_result = array_result.concat(array_ref);
            seen.add(prefixA);
        }
    }
    return array_result
}

export async function create_order_new(wixData) {
  let data = await EbilletsService.getByRef(wixData.data.ref);
  let address = await UsersService.getById(wixData.address._id);
  let prix_article = wixData.prix_article;
  let methode_paiement = wixData.methode_paiement;
  let variable_line_commande, command;

  let report = data;
  let ref = report.ref;
  if (report.commande) {
    command = await OrdersService.getById(report.commande);
  } else {
    let report_clone = await EbilletsService.getByidArticle(report.article);
    ref = report_clone.ref;
    command = await OrdersService.getByNumber(
      Number(ref.replace(/^[A-Za-z]/, "").split("-")[0])
    );
  }
  if (command.lineItems.length > 1) {
    variable_line_commande = parseInt(ref.split("-")[1]) - 1;
  } else {
    variable_line_commande = 0;
  }
  let lineItems = command.lineItems[variable_line_commande];
  let prix = 0;
  if (prix_article.prolongation) {
    prix += prix_article.prolongation;
  }
  if (prix_article.er) {
    prix += prix_article.er;
  }
  let ciel_evasion_id = "15d9204a-b1d1-4288-8e5e-24e0fde1b8d3";
  let partenaire = [await PartenairesService.getByIdEbillet(report._id)];
  let TVA;
  if (
    partenaire
      .map((a) => a._id)
      .join(" ")
      .includes(ciel_evasion_id)
  ) {
    TVA = 10;
  } else {
    TVA = Number(
      Math.round((lineItems.tax / (lineItems.price - lineItems.tax)) * 100)
    );
  }
  let tax = prix - prix / (1 + TVA / 100);
  delete command.paymentStatus;
  let methode;
  if (methode_paiement === "Successful") {
    command.paymentStatus = "PAID";
    methode = "Cartes de crédit/débit";
  } else {
    command.paymentStatus = "NOT_PAID";
    methode = "Offline";
  }
  delete command.number;
  delete command.cartId;
  delete command.totals;
  delete command.shippingInfo;
  delete command.billingInfo;
  delete command.buyerInfo;
  delete command.enteredBy;
  command.buyerNote = null;
  let member = await UsersService.getByEmail(address.loginEmail);
  let shippingInfo;
  let billingInfo;
  if (address.contactDetails.addresses.length > 0) {
    shippingInfo = {
      email: member.loginEmail,
      lastName: member.lastName,
      firstName: member.firstName,
      shipmentDetails: { address: address.contactDetails.addresses[0] },
    };
    billingInfo = {
      email: member.loginEmail,
      paymentMethod: methode,
      lastName: member.lastName,
      firstName: member.firstName,
      address: address.contactDetails.addresses[0],
    };
  } else {
    shippingInfo = {
      email: member.loginEmail,
      lastName: member.lastName,
      firstName: member.firstName,
      shipmentDetails: {
        address: {
          addressLine: "",
          city: "",
          country: "FR",
          postalCode: "",
        },
      },
    };
    billingInfo = {
      email: member.loginEmail,
      paymentMethod: methode,
      lastName: member.lastName,
      firstName: member.firstName,
      address: {
        addressLine: "",
        city: "",
        country: "FR",
        postalCode: "",
      },
    };
  }
  let buyerInfo = {
    email: member.loginEmail,
    lastName: member.lastName,
    firstName: member.firstName,
    id: member._id,
  };
  command.shippingInfo = shippingInfo;
  command.billingInfo = billingInfo;
  command.buyerInfo = buyerInfo;
  if (
    command.billingInfo.address &&
    command.shippingInfo.shipmentDetails.address
  ) {
    if (
      command.billingInfo.address.country &&
      command.shippingInfo.shipmentDetails.address.country
    ) {
      delete command.billingInfo.address.country;
      delete command.shippingInfo.shipmentDetails.address.country;
    }
  }
  command.totals = {
    subtotal: parseFloat((prix - tax).toFixed(2)),
    total: parseFloat(prix.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
  };
  let line = command.lineItems[variable_line_commande];
  delete line.options;
  delete line.customTextFields;
  delete command.lineItems;
  let item = [];
  if (prix_article.prolongation) {
    let line_prolongation = {
      weight: 0,
      name:
        "Prolongation : +12 mois supplémentaires e-Billet n° " + data.ref + "",
      quantity: 1,
      sku: "",
      lineItemType: "PHYSICAL",
      tax: parseFloat(
        (
          prix_article.prolongation -
          prix_article.prolongation / (1 + TVA / 100)
        ).toFixed(2)
      ),
      price: prix_article.prolongation,
      translatedName:
        "Prolongation : +12 mois supplémentaires e-Billet n° " + data.ref + "",
      totalPrice: prix_article.prolongation,
      priceData: {
        price: prix_article.prolongation,
        totalPrice: prix_article.prolongation,
        taxIncludedInPrice: true,
      },
      taxIncludedInPrice: true,
      productId: "59925db5-99be-3797-15df-9aaca85334ba",
      mediaItem: {
        altText: null,
        id: "5192e0_967c61eadc7d409eae2be1cffde6c6df~mv2.jpg",
        src: "wix:image://v1/5192e0_967c61eadc7d409eae2be1cffde6c6df~mv2.jpg/file.jpg#originWidth=400&originHeight=300",
        type: "IMAGE",
      },
      discount: 0,
    };
    item.push(line_prolongation);
    report.prolonge = true;
  }
  if (prix_article.er) {
    let line_ER = {
      weight: 0,
      name:
        "La Garantie : Échanges et Report​​​​ e-Billet n° ​" + data.ref + "",
      quantity: 1,
      sku: "",
      lineItemType: "PHYSICAL",
      tax: parseFloat(
        (prix_article.er - prix_article.er / (1 + TVA / 100)).toFixed(2)
      ),
      price: prix_article.er,
      translatedName:
        "La Garantie : Échanges et Report​​​​​​ e-Billet n° ​" + data.ref + "",
      totalPrice: prix_article.er,
      priceData: {
        price: prix_article.er,
        totalPrice: prix_article.er,
        taxIncludedInPrice: true,
      },
      taxIncludedInPrice: true,
      productId: "ec1c5528-c66a-1cd1-357f-98724fc56788",
      mediaItem: {
        altText: null,
        id: "5192e0_dbe6b39e57ff46778c3f744c55f5da47~mv2.jpg",
        src: "wix:image://v1/5192e0_dbe6b39e57ff46778c3f744c55f5da47~mv2.jpg/file.jpg#originWidth=3000&originHeight=1875",
        type: "IMAGE",
      },
      discount: 0,
    };
    item.push(line_ER);
    report.nb_er++;
    report.souscription = true;
  }
  await EbilletsService.updateEbillet(report);
  command.lineItems = item;
  return await OrdersService.insert(command);
}