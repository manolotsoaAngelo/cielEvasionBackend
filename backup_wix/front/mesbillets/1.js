import wixData from 'wix-data';
import wixMembers from 'wix-members';
import wixLocation from 'wix-location';
import wixWindow from 'wix-window';
import wixStorage from 'wix-storage';
import { getUrl } from 'backend/getUrl.jsw'
import { getCagnotteMembreByMembre } from 'backend/modules/services/cagnotte_membre_services'
import { crypter, decrypter } from 'backend/modules/fonctionnalites/information/cryptographie'
import { compressed_obj, decompressed_obj } from 'backend/modules/fonctionnalites/information/compression'
import { formatage_prix } from 'backend/private/function/function'
import { fonction_maj } from 'backend/public/function/function'
import {
    convertirCmEnMetres,
    chaine_opt,
    opt_reportByRef,
    formatage_date,
    capitalize,
    formatage_date_y_m_d,
    formatDate,
    french_formatPhone,
    parseDate,
    age,
    conversion_date,
    conversion_heure,
    formatUrl,
    conversion_date_ago
} from 'backend/modules/data/tiny_function';
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
    getOrderById_everyone
} from 'backend/modules/services/orders_services';
import {
    getAllProducts,
    getProductsById
} from 'backend/modules/services/products_services';
let opt = []
let formFactor = wixWindow.formFactor
let app_mobile = false
let dropDown_search = $w('#search')
let hidden_item = [$w('#nothing'), $w('#text432')]

$w.onReady(async function () {
    $w('#section2').hide()
    const start = Date.now();
    if (formFactor === 'Mobile') {
        app_mobile = true
    } else {
        app_mobile = false
    }
    let lien_meteo_bloquer = false
    let ref = wixLocation.query.ref_annul_meteo
    if (ref) {
        let ebillet = await getreportByRef(decodeURIComponent(ref))
        if (ebillet && ebillet.rdv) {
            let validiteDate = ebillet.rdv
            let one_day_before = new Date((validiteDate.getFullYear()), validiteDate.getMonth(), ((validiteDate.getDate()) - 1)).getTime();
            let validite = new Date((validiteDate.getFullYear()), validiteDate.getMonth(), ((validiteDate.getDate()))).getTime();
            let now = new Date((new Date().getFullYear()), new Date().getMonth(), (new Date().getDate())).getTime();
            if (ebillet.perime || ebillet.primDfinitif || ebillet.crdit || ebillet.satisfaction || now !== one_day_before) {
                lien_meteo_bloquer = true
            }
            if (validite === now) {
                lien_meteo_bloquer = false
            }
            if (!lien_meteo_bloquer) {
                wixWindow.openLightbox('Annulation météo', ebillet)
            }
        }
    }
    let member = await wixMembers.currentMember.getMember().then((res) => { return res })
    await load(member)
    retrieveAllItems()
    setTimeout(() => {
        wixWindow.scrollTo(0, 0, { "scrollAnimation": false });
    }, 1000);
    const end = Date.now();
    $w('#section2').show()
    console.log(`Mes billets a pris ${(end - start)/1000} s`);
});

export async function reporter_click(event) {
    let $item = $w.at(event.context)
    const data = $w("#repeater1").data;
    let clickedItemData = data.find(item => item._id === event.context.itemId)
    console.log(clickedItemData.ref)
    let category = await wixData.query('GROUPES').find().then((res) => { return res.items.filter(a => Number(a.entre) <= Number(clickedItemData.article.price)).filter(a => Number(a.et) >= Number(clickedItemData.article.price))[0] })
    let member = await wixMembers.currentMember.getMember().then((res) => { return res })
    let remb = clickedItemData.prix
    let obj = {
        member: member,
        clickedItemData: clickedItemData,
        remb: remb,
        category: category
    }
    if (clickedItemData.souscription) {
        wixWindow.openLightbox('Report', obj)
    } else {
        wixWindow.openLightbox('E/R non souscris', clickedItemData)
    }
}

export async function rembours_click(event) {
    let $item = $w.at(event.context)
    const data = $w("#repeater1").data;
    let clickedItemData = data.find(item => item._id === event.context.itemId)
    console.log(clickedItemData.ref)
    let category = await wixData.query('GROUPES').find().then((res) => { return res.items.filter(a => Number(a.entre) <= Number(clickedItemData.article.price)).filter(a => Number(a.et) >= Number(clickedItemData.article.price))[0] })
    let member = await wixMembers.currentMember.getMember().then((res) => { return res })
    let remb = clickedItemData.prix
    let obj = {
        member: member,
        clickedItemData: clickedItemData,
        remb: remb,
        category: category
    }
    wixWindow.openLightbox('Remboursement', obj)
}

export async function extend_click(event) {
    let $item = $w.at(event.context)
    const data = $w("#repeater1").data;
    let clickedItemData = data.find(item => item._id === event.context.itemId)
    console.log(clickedItemData.ref)
    let category = {}
    let prix = clickedItemData.prix
    let tax = 10
    let lowerTaxCateg = "c28d79bb-cfc6-bb40-33f8-6d6ac5ee53ef"
    await wixData.queryReferenced('Stores/Products', clickedItemData.article, 'collections').then(async (res) => {
        let categories = res.items
        if (categories.map(a => a._id).includes(lowerTaxCateg)) {
            tax = 10
        }
    })
    category = await wixData.query('GROUPES').find().then((res) => { return res.items.filter(a => Number(a.entre) <= Number(prix)).filter(a => Number(a.et) >= Number(prix))[0] })
    let perim = await wixData.query('BILLETBIENTOTPERIME').eq('groupe', category._id).find().then((res) => { return res.items[0].tarif })
    let member = await wixMembers.currentMember.getMember().then((res) => { return res })
    wixWindow.openLightbox('Prolongation (NON PÉRIMÉ)', {
        itemData: clickedItemData,
        tax: tax,
        perim: perim,
        title: 'Prolongation : ' + clickedItemData.ref,
        infos: {
            lastName: member.contactDetails.lastName,
            firstName: member.contactDetails.firstName,
            country: 'FRA',
            phone: member.contactDetails.phones[0],
            email: member.loginEmail
        }
    })
}

export function container2_mouseOut(event) {
    let $item = $w.at(event.context)
    const data = $w("#repeater1").data;
    let clickedItemData = data.find(item => item._id === event.context.itemId)
}

function normalizeString(str) {
    if (!str) return "";
    return str
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

function item_show_hide(type) {
    for (let item of hidden_item) {
        if (type === "show") {
            item.show()
            item.expand()
        } else {
            item.hide()
            item.collapse()
        }
    }
}

async function recherche_client() {
    const searchValue = normalizeString(dropDown_search.value);
    const filteredItems = opt.filter(a => String(a.nameNormalize).includes(searchValue));
    $w('#repeater2').data = filteredItems
    if (dropDown_search.value !== '' && filteredItems.length > 0) {
        const start = Date.now();
        await $w('#repeater2').forEachItem(($item, itemData) => {
            $item('#text293').text = itemData.name
        })
        const end = Date.now();
        console.log(`Recherche_client a pris ${(end - start)/1000} s`);
        item_show_hide("hide")
        $w('#repeater1').hide()
        $w('#repeater1').collapse()
        $w('#repeater2').expand()
    } else {
        $w('#repeater2').collapse()
    }
    if ($w('#repeater2').collapsed) {
        item_show_hide("show")
        $w('#repeater1').show()
        $w('#repeater1').expand()
    }
}

export async function text293_click(event) {
    $w('#repeater2').collapse()
    $w('#repeater1').collapse()
    let $item = $w.at(event.context)
    const data = $w("#repeater2").data;
    let clickedItemData = data.find(item => item._id === event.context.itemId)
    let member = await getMemberById(clickedItemData._id)
    await load(member)
    wixWindow.scrollTo(0, 0);
}

dropDown_search.onKeyPress(async (event) => {
    if (event.key === "Enter") {
        await recherche_client()
    }
})

dropDown_search.onInput(async (event) => {
    if (dropDown_search.value === '') {
        await recherche_client()
    }
})

dropDown_search.onChange(async (event) => {
    await recherche_client()
})

async function set_all_member() {
    const members = await getAllMember();
    const allItems = await Promise.all(
        members.map(a => ({
            name: a.name,
            _id: a._id,
            nameNormalize: normalizeString(a.name)
        }))
    );
    opt = allItems.filter((it) => it.name !== null);
    wixStorage.local.setItem('all_member', await compressed_obj(opt))
}

async function retrieveAllItems() {
    let role = await wixMembers.currentMember.getRoles()
        .then((roles) => {
            return roles.filter(r => r.title === "Admin" || r.title === "Owner" || r.title === "Co-Owner");
        })
    if (role.length > 0) {
        let color_2 = dropDown_search.style.color
        dropDown_search.style.color = "#7a7a7a"
        dropDown_search.value = "Chargement en cours"
        dropDown_search.disable()
        dropDown_search.show()
        dropDown_search.expand()
        let cached = wixStorage.local.getItem("all_member");
        if (cached) {
            opt = await decompressed_obj(cached)
            dropDown_search.value = null
            dropDown_search.style.color = color_2
            dropDown_search.enable()
            set_all_member()
        } else {
            await set_all_member()
            dropDown_search.value = null
            dropDown_search.style.color = color_2
            dropDown_search.enable()
        }
    }
}

async function load(member) {
    await $w('#dataset1').onReady(async () => {
        let requet = wixData.filter().eq('membre', member._id).ne('item_hidden', true).ne('statut_masque', true).isNotEmpty('url_Annulation_Meteo').isNotEmpty('nom').isNotEmpty('prenom')
            .or(wixData.filter().eq('lieu11', member.loginEmail).ne('item_hidden', true).ne('statut_masque', true).isNotEmpty('url_Annulation_Meteo').isNotEmpty('nom').isNotEmpty('prenom'))
        await $w('#dataset1').setFilter(requet).then(async (res) => {
            item_show_hide("show")
            await $w('#repeater1').forEachItem(async ($item, itemData, index) => {
                let beneficiaire

                itemData = await getreportById(itemData._id)
                itemData.article = await getProductsById(itemData.article)
                if (itemData.nom && itemData.prenom) {
                    beneficiaire = itemData.prenom + ' ' + itemData.nom
                } else {
                    beneficiaire = ''
                }
                $item('#nameInfos').text = 'Bénéficiaire : ' + beneficiaire
                $item('#img').src = itemData.article.mainMedia
                $item('#img').tooltip = ''
                $item('#numCommand').text = "N° e-Billet : " + itemData.ref
                $item('#annul').label = ''
                $item('#title').text = itemData.article.name

                if (itemData.rdv) {
                    $item('#rdv').show()
                    $item('#rdv').expand()
                    $item('#effectuer').hide()
                    $item('#reporter').enable()
                    $item('#bonDchange').disable()
                    $item('#bonDchange').label = 'RDV en attente'
                    let monthNames = ["Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin",
                        "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."
                    ];
                    let days = ["Dimanche", "Lundi", 'Mardi', "Mercredi", "Jeudi", "Vendredi", "Samedi"]
                    let jour = days[new Date(itemData.rdv).getDay()]
                    let date = new Date(itemData.rdv).getDate().toString()
                    let month = monthNames[new Date(itemData.rdv).getMonth()]
                    let year = new Date(itemData.rdv).getFullYear()
                    $item('#rdv').text = ['Date de prestation confirmée :', 'le ' + jour + ' ' + date + ' ' + month + ' ' + year + ' à ' + itemData.rdv.toLocaleTimeString().slice(0, 5)].join("\r\n")
                } else if (itemData.rdv == undefined) {
                    $item('#bonDchange').link = `/rdv?ref=${encodeURIComponent( (itemData.ref))}`
                    if (itemData.contrepropositionDate1 ||
                        itemData.contrepropositionDate2 ||
                        itemData.contrepropositionDate3) {
                        $item("#bonDchange").style.backgroundColor = "#ff9a00"
                        $item("#bonDchange").label = "Contre-proposition(s)"
                    } else {
                        $item("#bonDchange").label = "Prendre RDV"
                    }
                    $item('#bonDchange').enable()
                    $item('#reporter').disable()
                    $item('#effectuer').hide()
                    $item('#rdv').text = ""
                    if (app_mobile) {
                        $item('#rdv').text = "RGF0ZSBkZSBwcmVzdGF0aW9uIGNvbmZpcm3DqWUgOiBsZSAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi"
                        $item('#rdv').style.color = "#FFFFFF"
                    }
                }
                if (itemData.rdvDemand) {
                    $item('#effectuer').hide()
                    $item('#bonDchange').label = 'RDV en attente'
                }
                if (itemData.bonDchange) {
                    $item("#bonDchange").style.backgroundColor = "#228B22"
                    $item("#bonDchange").label = "Voir BON D’ÉCHANGE"
                    $item('#bonDchange').enable()
                    $item('#reporter').enable()
                    $item('#effectuer').hide()
                }
                if (!(itemData.bonDchange) && !(itemData.rdv)) {
                    $item('#reporter').disable()
                    $item('#effectuer').hide()
                }
                if (itemData.souscription && itemData.bonDchange) {
                    $item('#reporter').enable()
                    $item('#effectuer').hide()
                }
                if (itemData.libert) {
                    $item('#rembours').show()
                    if (itemData.bonDchange) {
                        $item('#reporter').enable()
                    }
                    $item('#effectuer').hide()
                }
                if (itemData.souscription) {
                    $item('#effectuer').hide()
                    $item('#textSubs').text = "Vous avez souscris à la garantie Échanges et Report"
                    $item('#textSubs').expand()
                } else {
                    $item('#textSubs').text = "Vous n'avez pas souscris à la garantie Échanges et Report"
                    $item('#textSubs').expand()
                    $item('#effectuer').hide()
                }
                $item('#date').text = ["Validité : Jusqu'au ", (new Date(new Date(itemData.validit))).toLocaleDateString()].join("\r\n")
                if (itemData.prolonge) {
                    $item('#rembours').disable()
                    $item('#annul').disable()
                    $item('#extend').hide()
                    $item('#annul').label = 'e-Billet déjà prolongé'
                }
                if (itemData.perime && !itemData.effectu && !itemData.rdv) {
                    $item('#annul').enable()
                    $item('#rembours').disable()
                    $item('#reporter').disable()
                    $item('#extend').hide()
                    $item('#annul').label = 'Prolonger mon e-Billlet'
                    $item('#effectuer').show()
                    $item('#textEffectue').text = 'Périmé !'
                }
                if (itemData.primDfinitif && !itemData.effectu && !itemData.rdv) {
                    $item('#rembours').disable()
                    $item('#annul').disable()
                    $item('#reporter').disable()
                    $item('#extend').hide()
                    $item('#effectuer').show()
                    $item('#textEffectue').text = 'Périmé définitif !'
                }
                if (itemData.effectu || (itemData.effectu && itemData.rdv)) {
                    if (!itemData.primDfinitif) {
                        $item('#annul').enable()
                    } else {
                        $item('#annul').disable()
                    }
                    $item('#bonDchange').show()
                    $item('#rembours').disable()
                    $item('#reporter').disable()
                    $item('#extend').hide()
                    $item('#annul').label = 'Déclarer une annulation météo'
                    let now = new Date();
                    let now_date = new Date(
                        now.getFullYear(),
                        now.getMonth(),
                        now.getDate(),
                        now.getHours(),
                        now.getMinutes()
                    ).getTime();
                    let rdvDate = new Date(itemData.rdv)
                    let rdv_2h = new Date(
                        rdvDate.getFullYear(),
                        rdvDate.getMonth(),
                        rdvDate.getDate(),
                        rdvDate.getHours() + 2,
                        rdvDate.getMinutes()
                    ).getTime();
                    if (now_date > rdv_2h) {
                        $item('#effectuer').show()
                        $item('#textEffectue').text = 'Date de prestation passée.'
                    }
                }
                if (itemData.crdit) {
                    $item('#rembours').disable()
                    $item('#annul').disable()
                    $item('#reporter').disable()
                    $item('#extend').hide()
                    $item('#effectuer').show()
                    $item('#textEffectue').text = 'Remboursé !'
                }
                if ($item('#rembours').enabled) {
                    $item('#annul').hide()
                }
                if (itemData.commande) {
                    let command = await getOrderById(itemData.commande);
                    if (command) {
                        let show_effectue = false
                        switch (command.paymentStatus) {
                        case 'NOT_PAID':
                            $item('#textEffectue').text = 'En attente de paiement';
                            show_effectue = true
                            break;
                        case 'PARTIALLY_PAID':
                            $item('#textEffectue').text = 'Partiellement payée';
                            show_effectue = true
                            break;
                        case 'PARTIALLY_REFUNDED':
                            $item('#textEffectue').text = 'Remboursé';
                            show_effectue = true
                            break;
                        default:
                            break;
                        }
                        if (show_effectue) {
                            $item('#rembours').disable()
                            $item('#annul').disable()
                            $item('#reporter').disable()
                            $item('#extend').hide()
                            $item('#effectuer').show()
                        }
                    }
                }
                $w('#repeater1').show()
                $w('#repeater1').expand()
            })
        })
    })

    let cagnotte = await getCagnotteMembreByMembre(member._id)
    let solde_cagnotte = 0
    if (cagnotte) {
        solde_cagnotte = cagnotte.soldeDeLaCagnotte
    }
    $w("#textSoldeCagnotte").text = await formatage_prix(solde_cagnotte) + " €"
}

export async function print_click(event) {
    let $item = $w.at(event.context)
    const data = $w("#repeater1").data;
    let clickedItemData = data.find(item => item._id === event.context.itemId)
    console.log(clickedItemData.ref)
    if (!(clickedItemData.bonDchange)) {
        if (app_mobile && !clickedItemData.ebillet) {
            wixWindow.openLightbox('Message Impression Pc')
        } else if (app_mobile && clickedItemData.ebillet) {
            let data = await getUrl(clickedItemData.ebillet)
            wixLocation.to(data)
        } else if (!app_mobile) {
            let url = `https://www.ciel-evasion.fr/impression-e-billet?ref=${encodeURIComponent( (clickedItemData.ref))}`;
            wixWindow.openLightbox('PopUpURL', url)
        }
    } else {
        if ($w('#bonDchange').link !== '' || clickedItemData.bonDchange) {
            if (app_mobile && clickedItemData.bonDchange) {
                let data = await getUrl(clickedItemData.bonDchange)
                wixLocation.to(data)
            } else if (!app_mobile && clickedItemData.bonDchange) {
                wixWindow.openLightbox('PopUpURLBondechange', clickedItemData.bonDchange)
            }
        }
    }
}

export async function bonDchange_click(event) {
    let $item = $w.at(event.context)
    const data = $w("#repeater1").data;
    let clickedItemData = data.find(item => item._id === event.context.itemId)
    console.log(clickedItemData.ref)
    if ($w('#bonDchange').link !== '' || clickedItemData.bonDchange) {
        if (app_mobile && clickedItemData.bonDchange) {
            let data = await getUrl(clickedItemData.bonDchange)
            wixLocation.to(data)
        } else if (!app_mobile && clickedItemData.bonDchange) {
            wixWindow.openLightbox('PopUpURLBondechange', clickedItemData.bonDchange)
        }
    } else {
        wixStorage.local.setItem('itemData', clickedItemData.ref)
    }
}

$w('#annul').onClick(async (event) => {
    let $item = $w.at(event.context)
    const data = $w("#repeater1").data;
    let clickedItemData = data.find(item => item._id === event.context.itemId)
    console.log(clickedItemData.ref)
    let category = {}
    let prix = clickedItemData.prix
    category = await wixData.query('GROUPES').find().then((res) => { return res.items.filter(a => Number(a.entre) <= Number(prix)).filter(a => Number(a.et) >= Number(prix))[0] })
    let member = await wixMembers.currentMember.getMember().then((res) => { return res })
    let perim = await wixData.query('BILLETPERIME').eq('groupe', category._id).find().then((res) => { return res.items[0].tarif })
    let tax = 10
    let lowerTaxCateg = "c28d79bb-cfc6-bb40-33f8-6d6ac5ee53ef"
    await wixData.queryReferenced('Stores/Products', clickedItemData.article, 'collections').then(async (res) => {
        let categories = res.items
        if (categories.map(a => a._id).includes(lowerTaxCateg)) {
            tax = 10
        }
    })
    let now = new Date()
    if (new Date(new Date(clickedItemData.validit).getFullYear(), new Date(clickedItemData.validit).getMonth(), new Date(clickedItemData.validit).getDate()).getTime() < now.getTime() && !clickedItemData.effectu) {
        wixWindow.openLightbox('Prolongation (PÉRIMÉ)', {
            itemData: clickedItemData,
            tax: tax,
            perim: perim,
            title: 'Prolongation : ' + clickedItemData.ref,
            infos: {
                lastName: member.contactDetails.lastName,
                firstName: member.contactDetails.firstName,
                country: 'FRA',
                phone: member.contactDetails.phones[0],
                email: member.loginEmail
            }
        })

    } else if (clickedItemData.effectu) {
        wixWindow.openLightbox('Annulation météo', clickedItemData)
    }
})

$w('#textSubs').onClick(async (event) => {
    const data = $w("#repeater1").data;
    let clickedItemData = data.find(item => item._id === event.context.itemId)
    console.log(clickedItemData.ref)
    let category = await wixData.query('GROUPES').find().then((res) => { return res.items.filter(a => Number(a.entre) <= Number(clickedItemData.article.price)).filter(a => Number(a.et) >= Number(clickedItemData.article.price))[0] })
    let member = await getMemberById(clickedItemData.membre)
    let remb = clickedItemData.prix
    let obj = {
        member: member,
        clickedItemData: clickedItemData,
        remb: remb,
        category: category
    }
    if (!clickedItemData.rdvDemand && clickedItemData.souscription) {
        wixWindow.openLightbox('Utilisation E/R (Prendre RDV)', obj)
    }
    if (clickedItemData.rdvDemand && clickedItemData.souscription) {
        wixWindow.openLightbox('Report', obj)
    }
    if (clickedItemData.rdvDemand && !clickedItemData.souscription) {
        wixWindow.openLightbox('E/R non souscris')
    }
})