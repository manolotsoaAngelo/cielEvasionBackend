import { compressed_obj, decompressed_obj } from '../utils/compression/compression.js'
import { get_wix_services } from '../utils/wixData/wixHttp.js'
import { all_ebillet,get_ebilletById,get_ebilletByRef } from '../services/ebillets.js';


///import { all_order,get_orderById } from '../services/orders.js';
let wixData_url = "https://ciel-evasion.fr/_functions/WixData/all_order/"

export async function get_orderById(id) {
    return (await get_wix_services(wixData_url + "_id/" + id)).data
}

export async function get_orderByNumber(Number) {
    return (await get_wix_services(wixData_url + "number/" + Number)).data
}

export async function all_order() {
    return await get_wix_services(wixData_url)
}

//console.log(await get_orderById('0a5ad329-d5cd-40d2-ace4-5d25fae1f758'))
//console.log(await all_order())

export async function create_order_new() {

   let data
    let address 
    let prix_article 
    let methode_paiement

    let variable_line_commande, command
    let report = await get_ebilletById(data._id)
    let ref = report.ref
    if (report.commande) {
        command = await get_orderById(report.commande)
    } else {
        let report_clone = (await get_all(wixData.query('Reports').eq('article', report.article).isNotEmpty('commande')))[0]
        ref = report_clone.ref
        command = await get_orderByNumber(Number((ref).replace(/^[A-Za-z]/, '').split('-')[0]))
    }
    if (command.lineItems.length > 1) {
        variable_line_commande = (parseInt((ref).split('-')[1]) - 1);
    } else {
        variable_line_commande = 0
    }
    let lineItems = command.lineItems[variable_line_commande]
    let prix = 0
    if (prix_article.prolongation) {
        prix += prix_article.prolongation
    }
    if (prix_article.er) {
        prix += prix_article.er
    }
    let ciel_evasion_id = "15d9204a-b1d1-4288-8e5e-24e0fde1b8d3"
    let partenaire = await wixData.queryReferenced('Reports', report._id, 'partenairetest').then((res) => { return res.items })
    let TVA
    if (partenaire.map(a => a._id).join(' ').includes(ciel_evasion_id)) {
        TVA = 10
    } else {
        TVA = Number(Math.round((lineItems.tax) / ((lineItems.price) - (lineItems.tax)) * 100))
    }
    let tax = prix - (prix / (1 + TVA / 100))
    delete command.paymentStatus
    let methode
    if (methode_paiement === "Successful") {
        command.paymentStatus = "PAID"
        methode = "Cartes de crédit/débit"
    } else {
        command.paymentStatus = "NOT_PAID"
        methode = "Offline"
    }
    delete command.number
    delete command.cartId
    delete command.totals
    delete command.shippingInfo
    delete command.billingInfo
    delete command.buyerInfo
    delete command.enteredBy
    command.buyerNote = null
    let member = await getMemberByEmail(address.loginEmail)
    let shippingInfo
    let billingInfo
    if ((address.contactDetails.addresses).length > 0) {
        shippingInfo = {
            "email": member.loginEmail,
            "lastName": member.lastName,
            "firstName": member.firstName,
            "shipmentDetails": { "address": address.contactDetails.addresses[0] }
        }
        billingInfo = {
            "email": member.loginEmail,
            "paymentMethod": methode,
            "lastName": member.lastName,
            "firstName": member.firstName,
            "address": address.contactDetails.addresses[0]
        }
    } else {
        shippingInfo = {
            "email": member.loginEmail,
            "lastName": member.lastName,
            "firstName": member.firstName,
            "shipmentDetails": {
                "address": {
                    "addressLine": "",
                    "city": "",
                    "country": "FR",
                    "postalCode": ""
                }
            }
        }
        billingInfo = {
            "email": member.loginEmail,
            "paymentMethod": methode,
            "lastName": member.lastName,
            "firstName": member.firstName,
            "address": {
                "addressLine": "",
                "city": "",
                "country": "FR",
                "postalCode": ""
            }
        }
    }
    let buyerInfo = {
        "email": member.loginEmail,
        "lastName": member.lastName,
        "firstName": member.firstName,
        "id": member._id
    }
    command.shippingInfo = shippingInfo
    command.billingInfo = billingInfo
    command.buyerInfo = buyerInfo
    if (command.billingInfo.address && command.shippingInfo.shipmentDetails.address) {
        if (command.billingInfo.address.country && command.shippingInfo.shipmentDetails.address.country) {
            delete command.billingInfo.address.country
            delete command.shippingInfo.shipmentDetails.address.country
        }
    }
    command.totals = {
        "subtotal": parseFloat((prix - tax).toFixed(2)),
        "total": parseFloat((prix).toFixed(2)),
        "tax": parseFloat((tax).toFixed(2))
    }
    let line = command.lineItems[variable_line_commande]
    delete line.options
    delete line.customTextFields
    delete command.lineItems
    let item = []
    if (prix_article.prolongation) {
        let line_prolongation = {
            "weight": 0,
            "name": "Prolongation : +12 mois supplémentaires e-Billet n° " + data.ref + "",
            "quantity": 1,
            "sku": "",
            "lineItemType": "PHYSICAL",
            "tax": parseFloat((prix_article.prolongation - (prix_article.prolongation / (1 + TVA / 100))).toFixed(2)),
            "price": prix_article.prolongation,
            "translatedName": "Prolongation : +12 mois supplémentaires e-Billet n° " + data.ref + "",
            "totalPrice": prix_article.prolongation,
            "priceData": {
                "price": prix_article.prolongation,
                "totalPrice": prix_article.prolongation,
                "taxIncludedInPrice": true
            },
            "taxIncludedInPrice": true,
            "productId": "59925db5-99be-3797-15df-9aaca85334ba",
            "mediaItem": {
                "altText": null,
                "id": "5192e0_967c61eadc7d409eae2be1cffde6c6df~mv2.jpg",
                "src": "wix:image://v1/5192e0_967c61eadc7d409eae2be1cffde6c6df~mv2.jpg/file.jpg#originWidth=400&originHeight=300",
                "type": "IMAGE"
            },
            "discount": 0
        }
        item.push(line_prolongation)
        report.prolonge = true
    }
    if (prix_article.er) {
        let line_ER = {
            "weight": 0,
            "name": "La Garantie : Échanges et Report​​​​ e-Billet n° ​" + data.ref + "",
            "quantity": 1,
            "sku": "",
            "lineItemType": "PHYSICAL",
            "tax": parseFloat((prix_article.er - (prix_article.er / (1 + TVA / 100))).toFixed(2)),
            "price": prix_article.er,
            "translatedName": "La Garantie : Échanges et Report​​​​​​ e-Billet n° ​" + data.ref + "",
            "totalPrice": prix_article.er,
            "priceData": {
                "price": prix_article.er,
                "totalPrice": prix_article.er,
                "taxIncludedInPrice": true
            },
            "taxIncludedInPrice": true,
            "productId": "ec1c5528-c66a-1cd1-357f-98724fc56788",
            "mediaItem": {
                "altText": null,
                "id": "5192e0_dbe6b39e57ff46778c3f744c55f5da47~mv2.jpg",
                "src": "wix:image://v1/5192e0_dbe6b39e57ff46778c3f744c55f5da47~mv2.jpg/file.jpg#originWidth=3000&originHeight=1875",
                "type": "IMAGE"
            },
            "discount": 0
        }
        item.push(line_ER)
        report.nb_er++
        report.souscription = true
    }
    await updatereport(report)
    command.lineItems = item
    return await wixStoresBackend.createOrder(command);
}