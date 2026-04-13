import wixAnimations from 'wix-animations';
import wixData from 'wix-data';
import wixWindow from 'wix-window';
import wixMembers from 'wix-members';
import wixLocation from 'wix-location';
import { session } from 'wix-storage';
import { crypter, decrypter } from 'backend/modules/fonctionnalites/information/cryptographie'
import {
    addPartenaire,
    updatePartenaire,
    getPartenaireById,
    getPartenaireByemail,
    getAllPartenaire,
} from 'backend/modules/services/partenaires_services';
import {
    getAllMember,
    getMemberByEmail,
    getMemberById,
    addMember_everyone,
    delete_Member_everyone,
    email_contact_By_member,
    getAllMember_everyone
} from 'backend/modules/services/membre_services';
import {
    getReserv_enattenteById,
    getReserv_reserveById,
    getReservationsByid_ebillet,
    addReservations,
    updateReservations,
    getAllReservationsbyPartenaire,
    getAllReservations,
    getAllReservbyPartenaire,
    getAllReserv_encoursbyPartenaire,
    getAllReserv_enattentebyPartenaire,
    getAllReserv_reservebyPartenaire,
    getAllReserv_encours,
    getAllReserv_enattente,
    getAllReserv_reserve,
    getAllReserv_fact,
    getAllReserv_annul,
    getAll_reservation_ContrePropositionByIdpartenaire,
    get_reservation_ContrePropositionByIdebillet,
    getAllreservation_ContreProposition
} from 'backend/modules/services/reservation_partenaires_services';
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
    convertirCmEnMetres,
    chaine_opt,
    chaine_opt_partenaire,
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
    getAllProducts
} from 'backend/modules/services/products_services';
import {
    getAllActivites
} from 'backend/modules/services/activites_services';

let clickedItemData, member, id_partenaire, id_reservation, id_changeTab = null
let all_dropDown = [$w('#recherche'), $w('#partenaireselect')]
let drop_recherche = all_dropDown[0]
let drop_partenaireselect = all_dropDown[1]

let all_rep = [$w('#repEnattent'), $w('#repetReserve'), $w('#repeatContreProposition')]

let repEnattent = all_rep[0]
let repetReserve = all_rep[1]
let repeatContreProposition = all_rep[2]

let radioDateDemand = $w('#radioDateDemand')

let partenaire_, admin, partenaireselect = false
let all_activite_hex = [
    ["Montgolfière", "#A3CCFD"],
    ["Hélicoptère", "#DBF3CC"],
    ["ULM", "#FDF2B1"],
    ["Parachute", "#E8BF9F"],
    ["Avion", "#DAA8A5"],
    ["Soufflerie", "#BBA8D5"],
    ["Simulateur", "#80B0FB"],
    ["Autogire", "#CB87F9"]
]
let formFactor = wixWindow.formFactor
let app_mobile = false
let role, partenaire, info_partenaire, all_Products

let timelineSpinner = null;
let spinner = $w('#spinnerLoad')

$w.onReady(async function () {
    const start = Date.now();
    $w('#sectionTop').collapse()
    $w('#section1').collapse()
    $w('#sectionFooter').collapse()

    if (formFactor === 'Mobile') {
        app_mobile = true
    } else {
        app_mobile = false
    }
    let error = false
    $w('#NbEnattent').text = "Nombre de résultat(s) : " + 0
    $w('#nbReserve').text = "Nombre de résultat(s) : " + 0
    $w('#nbContrePropo').text = "Nombre de résultat(s) : " + 0
    all_repet_hide()
    item_hide_show(drop_partenaireselect, "hide")
    member = await wixMembers.currentMember.getMember().then((res) => { return res })

    let [role_charg, partenaire_charg, all_Products_charg, allPartenaire_charg] = await Promise.all([
        wixMembers.currentMember.getRoles()
        .then((roles) => {
            return roles.filter(r => r.title === "Admin" || r.title === "Owner" || r.title === "Partenaire");
        }),
        getPartenaireByemail(member.loginEmail),
        getAllProducts(),
        getAllPartenaire()
    ]);

    let session_id_partenaire = session.getItem("id_partenaire");
    if (session_id_partenaire) {
        partenaireselect = true
        id_partenaire = session_id_partenaire
        partenaire_charg = await getPartenaireById(session_id_partenaire)
    }

    let session_id_partenaire_admin = session.getItem("id_partenaire_admin");
    if (session_id_partenaire_admin) {
        admin = true
        partenaireselect = false
        id_partenaire = null
    }

    role = role_charg, partenaire = partenaire_charg, all_Products = all_Products_charg
    if (role.length > 0) {
        if (role[0].title === "Partenaire") {
            if (admin) {
                admin = false
                session.removeItem("id_partenaire_admin");
            }
            partenaire_ = true
        } else if (role[0].title === "Admin" || role[0].title === "Owner") {
            if (!partenaire && !partenaire_) {
                admin = true
            }
            drop_input_insert(drop_partenaireselect, [...[{
                title: "ADMIN",
                _id: "admin_"
            }], ...allPartenaire_charg], "all_partenaires")
            item_hide_show(drop_partenaireselect, "show")
        }
    }
    if (partenaire || admin || partenaire_) {
        if (partenaire && partenaire.title) {
            if (admin) {
                $w("#titrePartenaire").text = "ADMIN"
            } else {
                $w("#titrePartenaire").text = partenaire.title
                partenaireselect = true
                id_partenaire = partenaire._id
            }
        }
        if ((!partenaire && admin) || partenaire_) {
            if (admin) {
                $w("#titrePartenaire").text = "ADMIN"
            } else {
                info_partenaire = await getMemberByEmail(member.loginEmail)
                $w("#titrePartenaire").text = info_partenaire.firstName
            }
        }
        $w('#sectionTop').expand()
        $w('#sectionFooter').expand()
        $w('#section1').expand()
        chargement()
    } else {
        error = true
    }
    const end = Date.now();
    console.log(`partenaire a pris ${(end - start)/1000} s`);
    if (error) {
        wixLocation.to('/')
    }
});

async function chargement() {
    const start = Date.now();
    all_repet_hide()
    if (partenaire || admin) {
        await Promise.all([
            chargement_load_drop_recherche(),
            chargement_load_data_show_item()
        ]);
    }
    const end = Date.now();
    console.log(`chargement a pris ${(end - start)/1000} s`);
}

repeatContreProposition.onItemReady(async ($item, itemData) => {
    let radioContrePropositions = $item('#radioContrePropositions')
    radioContrePropositions.onChange((event) => {
        if (radioContrePropositions.value) {
            $item('#supprContreProposition').enable()
        }
    })

    $item('#supprContreProposition').onClick(async () => {
        item_hide_show(repeatContreProposition, "hide")
        clickedItemData = itemData
        let all_contrepropositionDate = [clickedItemData.contrepropositionDate1, clickedItemData.contrepropositionDate2, clickedItemData.contrepropositionDate3]
        let i = 0
        for (let contreproposition of all_contrepropositionDate) {
            if (contreproposition) {
                i++
            }
        }
        if (i === 1) {
            clickedItemData.datePriseRdvClient = null
            clickedItemData.statut_reservation = null
        }
        if (String((new Date(clickedItemData.contrepropositionDate1)).getTime()) === radioContrePropositions.value) {
            clickedItemData.contrepropositionDate1 = null
        }
        if (String((new Date(clickedItemData.contrepropositionDate2)).getTime()) === radioContrePropositions.value) {
            clickedItemData.contrepropositionDate2 = null
        }
        if (String((new Date(clickedItemData.contrepropositionDate3)).getTime()) === radioContrePropositions.value) {
            clickedItemData.contrepropositionDate3 = null
        }
        await updatereport(clickedItemData)
        id_partenaire = null
        partenaireselect = false
        id_changeTab = 'singleTab7'
        await chargement()
        id_changeTab = null;
    });
});

$w('#imprimReserve').onClick(async (event) => {
    if (app_mobile) {
        wixWindow.openLightbox('Message Impression Pc')
    } else {
        const data = repetReserve.data;
        clickedItemData = data.find(item => item._id === event.context.itemId)
        let url = `https://www.ciel-evasion.fr/impression-reservation-partenaire?ref=${( (clickedItemData.ref))}`;
        wixWindow.openLightbox('PopUpURL', url)
    }
})

$w('#containerEnattent').onClick(async (event) => {
    const data = repEnattent.data;
    clickedItemData = data.find(item => item._id === event.context.itemId)
    wixLocation.to(`/partenaire-voir-plus?ref=${( (clickedItemData.ref))}`)
})

drop_partenaireselect.onChange(async (event) => {
    let value = String(drop_partenaireselect.value)
    if (value) {
        if (value !== "admin_") {
            partenaireselect = true
            id_partenaire = value
            session.setItem("id_partenaire", id_partenaire);
            if (admin) {
                admin = false
                session.removeItem("id_partenaire_admin");
            }
            partenaire = await getPartenaireById(value)
            $w("#titrePartenaire").text = partenaire.title
        } else {
            $w("#titrePartenaire").text = "ADMIN"
            session.setItem("id_partenaire_admin", value);
            admin = true
            id_partenaire = null
            session.removeItem("id_partenaire")
            partenaireselect = false
        }
        await chargement()
    }
})

drop_recherche.onChange(async (event) => {
    let value = String(drop_recherche.value)
    if (value === "Tous") {
        await chargement()
    } else {
        if (await getreportById(value)) {
            id_reservation = value
            await chargement()
            id_reservation = null
        }
    }
})

$w('#refresh').onClick(async (event) => {
    $w('#refresh').disable()
    let titre
    partenaire = await getPartenaireByemail(member.loginEmail)
    if (partenaire && partenaire.title) {
        titre = partenaire.title
        partenaireselect = true
        id_partenaire = partenaire._id
        drop_partenaireselect.value = partenaire._id
        if (admin) {
            admin = false
            session.removeItem("id_partenaire_admin");
        }
        await chargement()
    } else {
        info_partenaire = await getMemberByEmail(member.loginEmail)
        titre = info_partenaire.firstName
    }
    $w("#titrePartenaire").text = titre
    $w('#refresh').enable()
})

function drop_input_insert(dropDown, all_data, type) {
    const options = all_data.map((item) => {
        if (type === "allReservations") {
            let label
            if (item.prenom && item.nom) {
                label = item.ref + ' : ' + item.prenom + ' ' + item.nom
            } else {
                label = item.ref
            }
            return {
                label: label,
                value: item._id
            };
        } else if (type === "all_partenaires") {
            return {
                label: item.title,
                value: item._id
            };
        }
    });
    dropDown.options = options;
}

async function chargement_load_drop_recherche() {
    let allReservations
    if (admin && !partenaireselect) {
        allReservations = await getAllReservations()
    }
    if (partenaireselect) {
        allReservations = await getAllReservbyPartenaire(id_partenaire)
    }
    drop_input_insert(drop_recherche, allReservations, "allReservations")
    let drop_value = drop_recherche.options
    drop_recherche.options = [{
        label: "Tous",
        value: "Tous"
    }].concat(drop_value)
}

async function chargement_load_data_show_item() {
    let data_enattente = [],
        data_reserve = [],
        data_contreProposition = [],
        contreProposition_id_reservation = [],
        enattente_id_reservation = [],
        reserve_id_reservation = []
    if (!id_reservation) {
        if (admin) {
            [data_enattente, data_reserve, data_contreProposition] = await Promise.all([
                getAllReserv_enattente(),
                getAllReserv_reserve(),
                getAllreservation_ContreProposition()
            ]);
        }
        if (partenaireselect) {
            [data_enattente, data_reserve, data_contreProposition] = await Promise.all([
                getAllReserv_enattentebyPartenaire(id_partenaire),
                getAllReserv_reservebyPartenaire(id_partenaire),
                getAll_reservation_ContrePropositionByIdpartenaire(id_partenaire)
            ]);
        }
    } else {
        [enattente_id_reservation, reserve_id_reservation, contreProposition_id_reservation] = await Promise.all([
            getReserv_enattenteById(id_reservation),
            getReserv_reserveById(id_reservation),
            get_reservation_ContrePropositionByIdebillet(id_reservation)
        ]);
        if (contreProposition_id_reservation) {
            data_contreProposition = [contreProposition_id_reservation]
        }
        if (enattente_id_reservation) {
            data_enattente = [enattente_id_reservation]
        }
        if (reserve_id_reservation) {
            data_reserve = [reserve_id_reservation]
        }
    }

    let nb_Enattent = data_enattente.length,
        nb_reserve = data_reserve.length,
        nb_contrePropo = data_contreProposition.length

    $w('#NbEnattent').text = "Nombre de résultat(s) : " + nb_Enattent
    $w('#nbReserve').text = "Nombre de résultat(s) : " + nb_reserve
    $w('#nbContrePropo').text = "Nombre de résultat(s) : " + nb_contrePropo

    let all_onglet_id = ['singleTab3', 'singleTab7', 'singleTab6']
    let onglet_enattente = all_onglet_id[0]
    let onglet_contreProposition = all_onglet_id[1]
    let onglet_reserve = all_onglet_id[2]
    let array_onglet = [{ titre: "en attente", nb: nb_Enattent, _id: onglet_enattente },
        { titre: "contreProposition", nb: nb_contrePropo, _id: onglet_contreProposition },
        { titre: "reserver", nb: nb_reserve, _id: onglet_reserve }
    ]
    let onglet_show = "en attente"

    if (id_changeTab) {
        for (let onglet of array_onglet) {
            if (id_changeTab === onglet._id && onglet.nb > 0) {
                onglet_show = onglet.titre
                break
            }
        }
    }
    if (onglet_show === "en attente") {
        id_changeTab = null
    }
    if (!id_changeTab) {
        for (let onglet of array_onglet) {
            if (onglet.nb > 0) {
                onglet_show = onglet.titre
                break
            }
        }
    }
    switch (onglet_show) {
    case "reserver":
        showItems(data_reserve, repetReserve, "reserver");
        repeatContreProposition.hide()
        repEnattent.hide()
        $w('#listeReservation').changeTab(onglet_reserve)
        break;
    case "contreProposition":
        showItems(data_contreProposition, repeatContreProposition, "contreProposition");
        repetReserve.hide()
        repEnattent.hide()
        $w('#listeReservation').changeTab(onglet_contreProposition)
        break;
    case "en attente":
        if (nb_Enattent > 0) {
            showItems(data_enattente, repEnattent, "en attente");
        }
        repetReserve.hide()
        repeatContreProposition.hide()
        $w('#listeReservation').changeTab(onglet_enattente)
        break;
    default:
        break;
    }

    if (nb_Enattent === 0 && nb_reserve === 0 && nb_contrePropo === 0) {
        hide(spinner)
        //id_partenaire = null
        //partenaireselect = false
    }

    if (!id_reservation) {
        drop_recherche.value = null;
    }
    /*
        if (drop_partenaireselect.value !== "admin_") {
            drop_partenaireselect.value = null
        }
    */
}

function item_hide_show(item, type) {
    for (let i = 0; i < 2; i++) {
        if (type === 'show') {
            item.show()
            item.expand()
        } else if (type === 'hide') {
            item.hide()
            item.collapse()
        }
    }
}

function all_repet_hide() {
    all_rep.forEach(rep => {
        rep.hide()
        rep.expand()
        rep.data = [
            { _id: "1", value: "init" }
        ]
    });
    show(spinner)
}

let isLoading = false;
$w('#listeReservation').onTabItemClicked(async (event) => {
    if (isLoading) return;
    isLoading = true;
    id_changeTab = event.tabId;
    try {
        await chargement();
    } finally {
        id_changeTab = null;
        isLoading = false;
    }
});

function normalizeString(str) {
    if (!str) return "";
    return str
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

export function date_contre_propo(date) {
    return [(["Dimanche", "Lundi", 'Mardi', "Mercredi", "Jeudi", "Vendredi", "Samedi"][new Date(date).getDay()]) + ' ' + (new Date(date).getDate().toString()) + ' ' + (["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"][new Date(date).getMonth()]) + ' ' + (new Date(date).getFullYear()) + ' à ' + (new Date(date)).toLocaleTimeString().slice(0, 5)].join("\r\n")
}

export function date_Demand(date) {
    return [(["Dimanche", "Lundi", 'Mardi', "Mercredi", "Jeudi", "Vendredi", "Samedi"][new Date(date).getDay()]) + ' ' + (new Date(date).getDate().toString()) + ' ' + (["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"][new Date(date).getMonth()]) + ' ' + (new Date(date).getFullYear())].join("\r\n")
}

async function onglet_reserv_contrePropo(array_item, data, type) {

    let report = data.ebillet
    let opt = data.opt
    let lieu = data.lieu
    let prenom_nom = data.prenom_nom
    let activite = data.activite
    let article = data.article
    let dateRDV

    if (type === "reserver") {
        dateRDV = 'Date et Heure de réservation : inconnu'
    } else if (type === "contreProposition") {
        dateRDV = 'Contre-proposition, en cours :'
    }
    if (report.rdv) {
        let date = report.rdv
        dateRDV = ['​Rdv : ' + (["Dimanche", "Lundi", 'Mardi', "Mercredi", "Jeudi", "Vendredi", "Samedi"][new Date(date).getDay()]) + ' ' + (new Date(date).getDate().toString()) + ' ' + (["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"][new Date(date).getMonth()]) + ' ' + (new Date(date).getFullYear()) + ' à ' + (new Date(date)).toLocaleTimeString().slice(0, 5)].join("\r\n")
    }
    let tel = "",
        tirer = "",
        email = ""
    if (report.lieu111) {
        tel = "Tél : " + report.lieu111
    } else {
        tel = "Tél : " + "non saisi"
    }
    if ((report.lieu111 && report.lieu11) || tel !== "") {
        tirer = " - "
    }
    if (report.lieu11) {
        email = "Email : " + report.lieu11
    } else {
        email = "Email : " + "non saisi"
    }
    for (let [index, item] of array_item.entries()) {
        switch (index) {
        case 0:
            item.hide()
            break;
        case 1:
            item.text = dateRDV
            break;
        case 2:
            item.text = "Ref : " + report.ref
            item.style.fontSize = "14px"
            break;
        case 3:
            item.text = prenom_nom
            item.style.fontSize = "18px"
            item.style.fontWeight = "bold"
            break;
        case 4:
            item.src = article.mainMedia
            break;
        case 5:
            item.text = activite.title + " - " + article.name.slice(article.name.indexOf(': '), article.name.length).replace(': ', '') + lieu + opt
            break;
        case 6:
            item.text = tel + tirer + email
            break;
        case 7: {
            for (let activite_hex of all_activite_hex) {
                let titre = normalizeString(activite.title)
                let activite_titre = normalizeString(activite_hex[0])
                if ((titre).includes(activite_titre)) {
                    item.style.backgroundColor = activite_hex[1]
                    break;
                }
            }
            break;
        }
        case 8:
            if (type === "reserver") {
                let validiteDate = new Date(report.rdv)
                let one_day_before = new Date((validiteDate.getFullYear()), validiteDate.getMonth(), ((validiteDate.getDate()) - 1)).getTime();
                let validite = new Date((validiteDate.getFullYear()), validiteDate.getMonth(), ((validiteDate.getDate()))).getTime();
                let now = new Date((new Date().getFullYear()), new Date().getMonth(), (new Date().getDate())).getTime();
                item.forEach(btn => {
                    btn.show()
                    if (now !== one_day_before) {
                        btn.hide()
                    }
                    if (validite === now) {
                        btn.show()
                    }
                });
            } else if (type === "contreProposition") {
                let all_date_contreProposition = []
                if (report.contrepropositionDate1) {
                    all_date_contreProposition.push({ date: date_contre_propo((report.contrepropositionDate1)), _id: String((new Date(report.contrepropositionDate1)).getTime()) })
                }
                if (report.contrepropositionDate2) {
                    all_date_contreProposition.push({ date: date_contre_propo((report.contrepropositionDate2)), _id: String((new Date(report.contrepropositionDate2)).getTime()) })
                }
                if (report.contrepropositionDate3) {
                    all_date_contreProposition.push({ date: date_contre_propo((report.contrepropositionDate3)), _id: String((new Date(report.contrepropositionDate3)).getTime()) })
                }
                const options = all_date_contreProposition.map((item) => {
                    return {
                        label: item.date,
                        value: item._id
                    };
                });
                item.options = options;
            }
            break;
        default:
            break;
        }
    }
    array_item[0].show()
}

function show(spinner) {
    if (!timelineSpinner) {
        timelineSpinner = wixAnimations.timeline({ repeat: -1 })
            .add(spinner, {
                rotate: 360,
                duration: 1000,
                easing: "linear"
            });
    }
    timelineSpinner.play();
    spinner.show("fade", { duration: 300 });
}

function hide(spinner) {
    if (timelineSpinner) {
        timelineSpinner.pause();
    }
    const maxAttempts = 600;
    let attempts = 0;

    const waitForSpinner = setInterval(() => {
        if (!spinner.hidden) {
            clearInterval(waitForSpinner);
            spinner.rotation = 0;
            spinner.hide("fade", { duration: 300 });
        } else {
            attempts++;
            if (attempts >= maxAttempts) {
                clearInterval(waitForSpinner);
            }
        }
    }, 100);
}

async function showItems(items, repeater, type) {
    const start = Date.now();
    repeater.data = items

    await repeater.forEachItem(async ($item, itemData, index) => {
        let report = itemData
        let activite = await wixData.queryReferenced('Reports', report._id, 'activitetest').then(res => res.items[0])
        let [article, opt] = await Promise.all([
            (all_Products.filter(a => a._id === report.article))[0],
            chaine_opt_partenaire(report.ref)
        ]);
        if (opt) {
            opt = "\n" + "\u00A0\u00A0\u00A0" + opt.split(",").map(s => s.trim()).join(",\n" + "\u00A0\u00A0\u00A0");
        } else {
            opt = ""
        }
        let lieu = "",
            prenom_nom = report.prenom + " " + report.nom
        if (report.lieu) {
            lieu = " - à " + report.lieu
        }

        if (type === "contreProposition") {
            let item_ContreProposition = [$item('#containerContreProposition'),
                $item('#dateContreProposition'),
                $item('#refContreProposition'),
                $item('#nomPrenomContreProposition'),
                $item('#imageContreProposition'),
                $item('#titreContreProposition'),
                $item('#infoContreProposition'),
                $item('#boxContreProposition'),
                $item('#radioContrePropositions')
            ]
            $item('#supprContreProposition').disable()
            onglet_reserv_contrePropo(item_ContreProposition, {
                ebillet: report,
                opt: opt,
                lieu: lieu,
                prenom_nom: prenom_nom,
                activite: activite,
                article: article
            }, type)
        } else if (type === "reserver") {
            let item_reserver = [$item('#containerReserve'),
                $item('#dateReservation'),
                $item('#refReserve'),
                $item('#ReservprenomNOM'),
                $item('#imageReserve'),
                $item('#titreReserve'),
                $item('#contactClient'),
                $item('#boxReserver'),
                [$item('#btnSms'), $item('#btnConfRdv')]

            ]
            onglet_reserv_contrePropo(item_reserver, {
                ebillet: report,
                opt: opt,
                lieu: lieu,
                prenom_nom: prenom_nom,
                activite: activite,
                article: article
            }, type)
        } else if (type === "en attente") {
            let item_Enattente = [$item('#containerEnattent'), $item('#enAttente'), $item('#refEnattente'), $item('#prenomNOMEnattente'), $item('#boxRef'),
                $item('#imageEnattent'), $item('#titrEnattent'), $item('#vpEnattent'), $item('#radioDateDemand')
            ]
            let date_ago = await conversion_date_ago(report.datePriseRdvClient)
            for (let [index, item] of item_Enattente.entries()) {
                switch (index) {
                case 0:
                    item.hide()
                    break;
                case 1:
                    item.text = "En attente depuis " + date_ago.valeur + " " + date_ago.type
                    break;
                case 2:
                    item.text = "Ref : " + report.ref
                    item.style.fontSize = "14px"
                    break;
                case 3:
                    item.text = prenom_nom;
                    item.style.fontSize = "18px"
                    item.style.fontWeight = "bold"
                    break;
                case 4:
                    if ((["seconde", "secondes", "minute", "minutes", "heure"].includes(date_ago.type)) || date_ago.valeur < 24 && date_ago.type === "heures") {
                        item.style.backgroundColor = "#228B22"
                    } else if ((date_ago.valeur === 1 && date_ago.type === "jour") || (date_ago.valeur === 2 && date_ago.type === "jours")) {
                        item.style.backgroundColor = "#ff9a00"
                    } else {
                        item.style.backgroundColor = "#ff1a1a"
                    }
                    break;
                case 5:
                    item.src = article.mainMedia
                    break;
                case 6:
                    item.text = activite.title + " - " + article.name.slice(article.name.indexOf(': '), article.name.length).replace(': ', '') + lieu + opt
                    break;
                case 7:
                    item.link = `/partenaire-voir-plus?ref=${( (report.ref))}`
                    break;
                case 8:
                    if (report.rdvDemand1 && report.rdvDemand11 && report.rdvDemand111) {
                        let all_dateDemand = []
                        if (report.rdvDemand1) {
                            all_dateDemand.push({ date: date_Demand((report.rdvDemand1)) + " - " + report.choixHoraireDate1, _id: String((new Date(report.rdvDemand1)).getTime()) })
                        }
                        if (report.rdvDemand11) {
                            all_dateDemand.push({ date: date_Demand((report.rdvDemand11)) + " - " + report.choixHoraireDate2, _id: String((new Date(report.rdvDemand11)).getTime()) })
                        }
                        if (report.rdvDemand111) {
                            all_dateDemand.push({ date: date_Demand((report.rdvDemand111)) + " - " + report.choixHoraireDate3, _id: String((new Date(report.rdvDemand111)).getTime()) })
                        }
                        const options_dateDemand = all_dateDemand.map((item) => {
                            return {
                                label: item.date,
                                value: item._id
                            };
                        });
                        item.options = options_dateDemand;
                        item.disable();
                    } else {
                        item.hide()
                    }

                    break;
                default:
                    break;
                }
            }
            item_Enattente[0].show()
        }
        if ((items.length) - 1 === index) {
            hide(spinner)
            repeater.show('fade', { duration: 600 })
            const end = Date.now();
            console.log(`showItems a pris ${(end - start)/1000} s`);
        }
    })
}

$w.onReady(() => {
    const menuIcon = $w("#menuIcon");
    const contactButton = $w("#contact");
    let isPopupOpen = false;
    let isContactPopupOpen = false;

    if (menuIcon) {
        menuIcon.onClick(() => {
            if (!isPopupOpen) {
                menuIcon.src = "https://static.wixstatic.com/media/5192e0_57c86f6707974178a298aed84188edb1~mv2.png";
                wixWindow.openLightbox("PopupMenuPartenaire").then(() => {
                    menuIcon.src = "https://static.wixstatic.com/media/5192e0_41600e96268b410897c950d1fcd579c1~mv2.png";
                    isPopupOpen = false;
                });
                isPopupOpen = true;
            }
        });
    }

    if (contactButton) {
        contactButton.onClick(() => {
            if (!isContactPopupOpen) {
                wixWindow.openLightbox("PopupContactPartenaire").then(() => {
                    isContactPopupOpen = false;
                });
                isContactPopupOpen = true;
            } else {
                wixWindow.lightbox.close();
                isContactPopupOpen = false;
            }
        });
    }
});

function normalizePhoneFR(raw) {
    if (!raw) return "";
    let s = String(raw).replace(/[^\d+]/g, "");
    if (s.startsWith("0")) s = "+33" + s.slice(1);
    if (!s.startsWith("+") && s.length === 10) s = "+33" + s.slice(1);
    return s;
}

function notif_($item, itemData, type) {

    if (itemData.lieu111) {
        let nomBenef = $item('#ReservprenomNOM').text || "Client";
        let refBillet = ($item('#refReserve').text || "").replace("Ref : ", "") || "inconnu";
        let numero = normalizePhoneFR(itemData.lieu111);
        let pop_up
        if (type === "btnSms") {
            pop_up = "notif annul meteo"
        } else if (type === "btnConfRdv") {
            pop_up = "notif confirm meteo"
        }
        wixWindow.openLightbox(pop_up, { nom: nomBenef, ref: refBillet, numero: numero });
    } else {
        wixWindow.openLightbox("Info", { message: "Numéro (Tel Point Météo) manquant dans la base." });
    }

}

$w('#repetReserve').onItemReady(($item, itemData) => {
    $item('#btnSms').onClick(() => {
        notif_($item, itemData, "btnSms")
    });
    $item('#btnConfRdv').onClick(() => {
        notif_($item, itemData, "btnConfRdv")
    });
});