import wixData from 'wix-data';
import wixStoresBackend from 'wix-stores-backend';
import { get_all } from 'backend/modules/data/get_all_crud';
import {
    getreportById,
    getAllreport_member_empty,
    getAllreport,
    getreportByRef,
    getreportByCommande,
    addreport,
    deletereport,
    updatereport,
    insert_Reports_Bynumber,
    delete_ebilletPdf,
    delete_bonDchange,
    check_Allreport
} from 'backend/modules/services/reports_services';
import {
    getAllMember,
    getMemberByEmail,
    getMemberById,
    addMember_everyone,
    delete_Member_everyone,
    email_contact_By_member
} from 'backend/modules/services/membre_services';
/*
import {
    create_order_new,
    all_Orders_FULLY_REFUNDED,
    generation_commande,
    getAllOrders,
    getAllCancelledOrders,
    getOrderById_cancel,
    getOrderById,
    getOrderByNumber,
    addOrder_everyone,
    getOrderById_everyone,
    getAllOrders_everyone
} from 'backend/modules/services/orders_services';
*/
const COLLECTION_NAME = "Stores/Orders"
const COLLECTION_NAME_everyone = "Orders_everyone"

export async function create_order_new(data, address, prix_article, methode_paiement) {
    let variable_line_commande, command
    let report = await getreportById(data._id)
    let ref = report.ref
    if (report.commande) {
        command = await getOrderById(report.commande)
    } else {
        let report_clone = (await get_all(wixData.query('Reports').eq('article', report.article).isNotEmpty('commande')))[0]
        ref = report_clone.ref
        command = await getOrderByNumber(Number((ref).replace(/^[A-Za-z]/, '').split('-')[0]))
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

export async function all_Orders_FULLY_REFUNDED() {
    const start = Date.now();
    let all_Orders_FULLY_REFUNDED = await get_all(wixData.query(COLLECTION_NAME).eq('archived', false).eq('paymentStatus', "FULLY_REFUNDED"))
    if (!all_Orders_FULLY_REFUNDED) {
        all_Orders_FULLY_REFUNDED = await get_all(wixData.query(COLLECTION_NAME_everyone).eq('archived', false).eq('paymentStatus', "FULLY_REFUNDED"))
    }
    let save_report = []
    for (let orders of all_Orders_FULLY_REFUNDED) {
        let report = await getreportByCommande(orders._id)
        if (report) {
            if (!report.crdit) {
                report.crdit = true
                save_report.push(report)
            }
        }
    }

    const end = Date.now();
    console.log(`all_Orders_FULLY_REFUNDED a pris ${(end - start)/1000} s`);

    if (save_report.length > 0) {
        //console.log(save_report)
        await wixData.bulkUpdate("Reports", save_report);
    }

    return save_report
}

export async function generation_commande(data) {
    /*
    const data = {
        ebillet: ebillet,
        non_perime: non_perime,
        er: er,
        perime: perime
    };
    */
    let ref = data.ebillet
    let report = await getreportByRef(ref)
    if (report) {
        let membre = await getMemberById(report.membre)
        let address = membre
        let clickedItemData = report
        let prix = clickedItemData.prix
        let category = await wixData.query('GROUPES').find().then((res) => { return res.items.filter(a => Number(a.entre) <= Number(prix)).filter(a => Number(a.et) >= Number(prix))[0] })
        let er = await wixData.query('ECHANGESETREPORT').eq('reference', category._id).find().then((res) => { return res.items[0].tarif })
        let prolongation
        if (data.perime) {
            prolongation = await wixData.query('BILLETPERIME').eq('groupe', category._id).find().then((res) => { return res.items[0].tarif })
        } else if (data.non_perime) {
            prolongation = await wixData.query('BILLETBIENTOTPERIME').eq('groupe', category._id).find().then((res) => { return res.items[0].tarif })
        }
        let prix_article
        let methode_paiement = "Successful"
        if ((data.non_perime || data.perime) && data.er) {
            prix_article = {
                "prolongation": prolongation,
                "er": er
            }
        }
        if ((!data.non_perime || !data.perime) && data.er) {
            prix_article = {
                "prolongation": null,
                "er": er
            }
        }
        if ((data.non_perime || data.perime) && !(data.er)) {
            prix_article = {
                "prolongation": prolongation,
                "er": null
            }
        }

        return await create_order_new(report, address, prix_article, methode_paiement)
    } else {
        return null
    }
}

export async function getAllOrders() {
    const start = Date.now();
    let commande = await get_all(wixData.query(COLLECTION_NAME).eq('archived', false).ne('fulfillmentStatus', "CANCELED"))
    if (!commande) {
        commande = await getAllOrders_everyone()
    }
    const end = Date.now();
    console.log(`getAllOrders a pris ${(end - start)/1000} s`);

    return commande
}

export async function getAllCancelledOrders() {
    let allCancelledOrders = await get_all(wixData.query(COLLECTION_NAME).eq("fulfillmentStatus", "CANCELED").or(wixData.query(COLLECTION_NAME).eq("archived", true)))
    return allCancelledOrders
}

export async function getOrderById_cancel(orderId) {
    return (await get_all(wixData.query(COLLECTION_NAME).eq('_id', orderId).eq("fulfillmentStatus", "CANCELED")))[0]
}

export async function getOrderById(orderId) {
    let commande
    try {
        commande = await wixData.get(COLLECTION_NAME, orderId)
    } catch (error) {
        commande = await getOrderById_everyone(orderId)
    }
    if (!commande) {
        commande = await getOrderById_everyone(orderId)
    }
    return commande
}

export async function getOrderByNumber(number) {
    let order
    try {
        order = (await get_all(wixData.query(COLLECTION_NAME).eq('number', Number(number))))[0]
    } catch (error) {
        order = (await get_all(wixData.query(COLLECTION_NAME_everyone).eq('number', Number(number)))).map(order => {
            delete order._id
            order._id = order.nouveau_champ_id;
            return order;
        })[0]
    }
    if (order) {
        return order
    } else {
        return null
    }
}

/////////////////////////////EVERYONE

export async function order_everyone() {
    const Orders_everyone = (await getAllOrders_everyone()).map(item => item.nouveau_champ_id);
    const insert_item = (await get_all(wixData.query(COLLECTION_NAME).eq('archived', false))).filter(order => order.fulfillmentStatus !== 'CANCELED').map(order => {
        order.nouveau_champ_id = order._id;
        return order;
    });
    const new_orders = insert_item.filter(item => !Orders_everyone.includes(item._id));
    if (new_orders.length > 0) {
        return await wixData.bulkSave(COLLECTION_NAME_everyone, new_orders)
    }
}

export async function getOrderById_everyone(orderId) {
    let order = (await get_all(wixData.query(COLLECTION_NAME_everyone).eq('nouveau_champ_id', orderId))).map(order => {
        delete order._id
        order._id = order.nouveau_champ_id;
        return order;
    })[0]
    if (order) {
        return order
    } else {
        return null
    }
}

export async function getAllOrders_everyone() {
    const start = Date.now();
    let allOrders_everyone = (await get_all(wixData.query(COLLECTION_NAME_everyone).eq('archived', false).ne('fulfillmentStatus', "CANCELED"))).map(order => {
        delete order._id
        order._id = order.nouveau_champ_id;
        return order;
    })
    const end = Date.now();
    console.log(`getAllOrders_everyone a pris ${(end - start)/1000} s`);
    return allOrders_everyone
}

export async function addOrder_everyone(Order) {
    return await wixData.insert(COLLECTION_NAME_everyone, Order)
}

/*
export async function test_generation_commande() {
    let ref = "H10865-1"
    let report = await getreportByRef(ref)
    const data = {
        ebillet: ref,
        prolongation: true,
        er: true,
        perime: true
    };
    if (report) {
        let membre = await getMemberById(report.membre)
        let address = membre
        let clickedItemData = report
        let prix = clickedItemData.prix
        let category = await wixData.query('GROUPES').find().then((res) => { return res.items.filter(a => Number(a.entre) <= Number(prix)).filter(a => Number(a.et) >= Number(prix))[0] })
        let er = await wixData.query('ECHANGESETREPORT').eq('reference', category._id).find().then((res) => { return res.items[0].tarif })
        let prolongation
        if (data.perime) {
            prolongation = await wixData.query('BILLETPERIME').eq('groupe', category._id).find().then((res) => { return res.items[0].tarif })
        } else {
            prolongation = await wixData.query('BILLETBIENTOTPERIME').eq('groupe', category._id).find().then((res) => { return res.items[0].tarif })
        }
        let ref_chaine = ''
        let prix_article
        let methode_paiement = "Successful"
        if (data.prolongation && data.er) {
            prix_article = {
                "prolongation": prolongation,
                "er": er
            }
        } else if (!(data.prolongation) && data.er) {
            prix_article = {
                "prolongation": null,
                "er": er
            }
        } else if (data.prolongation && !(data.er)) {
            prix_article = {
                "prolongation": prolongation,
                "er": null
            }
        } else if (!(data.prolongation) && !(data.er)) {
            prix_article = {
                "prolongation": null,
                "er": null
            }
        }
        //return prix_article
        return await create_order(ref, address, prix_article, methode_paiement, ref_chaine)
    } else {
        return null
    }
}
*/