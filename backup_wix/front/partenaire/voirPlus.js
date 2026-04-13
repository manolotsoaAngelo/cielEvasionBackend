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
    mntContribution
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
    getAllReserv_encoursbyPartenaire,
    getAllReserv_enattentebyPartenaire,
    getAllReserv_reservebyPartenaire,
    getAllReserv_encours,
    getAllReserv_enattente,
    getAllReserv_reserve,
    getAllReserv_fact,
    getAllReserv_annul
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
    opt_reportByRef,
    formatage_date,
    capitalize,
    formatage_date_y_m_d,
    formatDate,
    french_formatPhone,
    parseDate,
    age,
    conversion_date,
    conversion_heure
} from 'backend/modules/data/tiny_function';
import {
    getAllProducts,
    getProductsById
} from 'backend/modules/services/products_services';
let member, ref, report, partenaire, allPartenaire, role, admin_name, partenaire_
let admin = false
let disponibles = [$w('#disponibl1'), $w('#disponibl2'), $w('#disponibl3')]
let timeRdvs = [$w('#timeRdv1'), $w('#timeRdv2'), $w('#timeRdv3')]
let all_input_contre_propositiondate = [$w('#propositiondate1'), $w('#propositiondate2'), $w('#propositiondate3')]
let drop_partenaireselect = $w('#partenaireselect')
let away = new Date()
away.setFullYear(1800)
let minDate = new Date()
minDate.setDate(minDate.getDate() + 2)

$w.onReady(async function () {
    const start = Date.now();
    $w('#boxPartenaireVoirPlus').hide()
    $w('#sectionMenu').hide()
    $w('#sectionFooter').hide()
    item_hide_show(drop_partenaireselect, "hide")
    let error = false
    let params = wixLocation.query;
    if (params.ref) {
        //member = await getMemberByEmail("contact@ciel-evasion.fr")
        [ref, member] = await Promise.all([
            ((params.ref)),
            wixMembers.currentMember.getMember().then((res) => { return res })
        ]);
        report = await getreportByRef(ref)
        if (report) {
            [role, partenaire, allPartenaire] = await Promise.all([
                wixMembers.currentMember.getRoles()
                .then((roles) => {
                    return roles.filter(r => r.title === "Admin" || r.title === "Owner" || r.title === "Partenaire");
                }),
                getPartenaireByemail(member.loginEmail),
                getAllPartenaire()
            ]);
            let session_id_partenaire = session.getItem("id_partenaire");
            if (session_id_partenaire) {
                partenaire = await getPartenaireById(session_id_partenaire)
            }
            let session_id_partenaire_admin = session.getItem("id_partenaire_admin");
            if (session_id_partenaire_admin) {
                admin_name = true
            }

            if (role.length > 0) {
                if (role[0].title === "Partenaire") {
                    if (admin_name) {

                        admin_name = false
                        session.removeItem("id_partenaire_admin");
                    }
                    partenaire_ = true
                } else if (role[0].title === "Admin" || role[0].title === "Owner") {
                    admin = true
                }
            }
            if (partenaire || admin || partenaire_) {
                if (!admin) {
                    item_hide_show(drop_partenaireselect, "hide")
                } else {
                    drop_input_insert(drop_partenaireselect, [...[{
                        title: "ADMIN",
                        _id: "admin_"
                    }], ...allPartenaire])
                    //drop_input_insert(drop_partenaireselect, allPartenaire)
                    item_hide_show(drop_partenaireselect, "show")
                }
                if (partenaire && partenaire.title) {
                    if (admin_name) {
                        $w("#titrePartenaire").text = "ADMIN"
                    } else {
                        $w("#titrePartenaire").text = partenaire.title
                    }
                }
                if ((admin && !partenaire) || partenaire_) {
                    let info_partenaire = await getMemberByEmail(member.loginEmail)
                    if (admin_name) {
                        $w("#titrePartenaire").text = "ADMIN"
                    } else {
                        $w("#titrePartenaire").text = info_partenaire.firstName
                    }
                }
                if (report.rdv || report.contrepropositionDate1 || report.contrepropositionDate2 || report.contrepropositionDate3 || partenaire_) {
                    wixLocation.to('https://www.ciel-evasion.fr/partenaire')
                } else {
                    await chargementPlanif(report)
                    $w('#boxPartenaireVoirPlus').show()
                    $w('#sectionMenu').show()
                    $w('#sectionFooter').show()
                }
            } else {
                error = true
            }
        } else {
            error = true
        }
    }
    if (error) {
        wixLocation.to('/')
    }
    const end = Date.now();
    console.log(`Partenaire voir plus a pris ${(end - start)/1000} s`);
});

drop_partenaireselect.onChange(async (event) => {
    let value = String(drop_partenaireselect.value)
    if (value) {
        if (value === "admin_") {
            $w("#titrePartenaire").text = "ADMIN"
            session.setItem("id_partenaire_admin", value);
        } else {
            partenaire = await getPartenaireById(value)
            session.setItem("id_partenaire", value);
            if (admin_name) {

                admin_name = false
                session.removeItem("id_partenaire_admin");
            }
            $w("#titrePartenaire").text = partenaire.title
        }
    }
})

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

function drop_input_insert(dropDown, all_data) {
    const options = all_data.map((item) => {
        return {
            label: item.title,
            value: item._id
        };
    });
    dropDown.options = options;
}

export async function chargementPlanif(report) {
    onFocus_onClick()
    onChange_proposition_contre()
    input_proposition_contre("contre", "disable")
    let [article, activite, ageClient, taille, dateDachat, contribution, opt] = await Promise.all([
        getProductsById(report.article),
        wixData.queryReferenced('Reports', report._id, 'activitetest').then(res => res.items[0]),
        age(report.date_de_naissance),
        convertirCmEnMetres(report.taille),
        conversion_date(report.validit),
        mntContribution(report),
        chaine_opt(report.ref)
    ]);
    let lieu = ''
    if (report.lieu) {
        lieu = " - à " + report.lieu
    }
    if (opt) {
        opt = "\n" + "\u00A0\u00A0\u00A0" + opt
    } else {
        opt = ""
    }
    let all_dispo = [$w("#dispo1"), $w("#dispo2"), $w("#dispo3")]
    let all_rdvDemand = [report.rdvDemand1, report.rdvDemand11, report.rdvDemand111]
    let all_choixHoraireDate = [report.choixHoraireDate1, report.choixHoraireDate2, report.choixHoraireDate3]
    const convertedDates = await Promise.all(
        all_rdvDemand.map(date => conversion_date(date))
    );
    all_dispo.forEach((dispo, i) => {
        dispo.html = `<span style="font-size:18px;">${convertedDates[i]}</span><span style="font-size:14px;">&nbsp; : &nbsp;${all_choixHoraireDate[i]}</span>`;
    });
    let all_input_disponibl = disponibles
    let all_input_timeRdv1 = timeRdvs
    let all_input_propositiondate = [$w('#propositiondate1'), $w('#propositiondate2'), $w('#propositiondate3')]
    for (let [index, input_propositiondate] of all_input_propositiondate.entries()) {
        input_propositiondate.minDate = minDate
        input_propositiondate.maxDate = new Date(new Date(report.validit))
        all_input_disponibl[index].checked = false
        all_input_timeRdv1[index].required = false
        all_input_timeRdv1[index].value = null
    }
    $w("#refTitre").text = "REF : " + report.ref
    $w("#titrVpEnattent").text = activite.title + " - " + article.name.slice(article.name.indexOf(': '), article.name.length).replace(': ', '') + lieu + opt
    $w("#imagVpEnattent").src = article.mainMedia
    $w("#infoParticip").text = report.prenom + " " + report.nom + " - " + ageClient + " ans - " + report.poids + " kg - " + "Taille " + taille
    $w("#dateDachat").text = dateDachat
    $w("#prix").text = report.prix + ' €'
    $w("#mntContribution").text = contribution + ' €'
    $w("#inforeservation").show()
    $w("#inforeservation").expand()
    $w("#infoReservation2").show()
    $w("#infoReservation2").expand()
}

function preference_horaire(horaire) {
    if (horaire === "Matin") {
        return { debut: [0, 0], fin: [12, 59] }
    } else if (horaire === "Après-midi") {
        return { debut: [13, 0], fin: [23, 59] }
    } else if (horaire === "Soir") {
        return { debut: [14, 0], fin: [23, 59] }
    } else if (horaire === "Sans préférence d'horaire") {
        return { debut: [0, 0], fin: [23, 59] }
    }
}

function horaire_split(horaire) {
    let [hours, minutes, seconds] = horaire.split(":");
    return { hours: Number(hours), minutes: Number(minutes), seconds: Number(seconds) }
}

function update_saveProposition() {
    let invalid = []
    let input_time = timeRdvs
    let reservation = report
    let all_horaire_rdv = [reservation.choixHoraireDate1, reservation.choixHoraireDate2, reservation.choixHoraireDate3]
    let i = 0
    for (let input of input_time) {
        if (input.required) {
            if (input.value) {
                let error_input = false
                let horaire_rdv = preference_horaire(all_horaire_rdv[i])
                let horaire_input = horaire_split(input.value)
                if (!((horaire_input.hours >= (horaire_rdv.debut)[0] && horaire_input.minutes >= (horaire_rdv.debut)[1]) &&
                        (horaire_input.hours <= (horaire_rdv.fin)[0] && horaire_input.minutes <= (horaire_rdv.fin)[1]))) {
                    error_input = true
                }
                if (all_horaire_rdv[i] === "Matin" && horaire_input.hours === 13 && horaire_input.minutes === 0) {
                    error_input = false
                }
                if (error_input) {
                    $w('#msgVpSaveReserve').text = "Vérifiez le créneau horaire du client"
                    invalid.push(input)
                }
            } else if (!input.value) {
                $w('#msgVpSaveReserve').text = "​Veuillez saisir l'horaire du RDV"
                invalid.push(input)
            }
        }
        i++
    }
    if (invalid.length == 0) {
        $w('#msgVpSaveReserve').hide()
        return true
    } else {
        $w('#msgVpSaveReserve').show()
        return false
    }
}

function update_saveContreProposition() {
    let liste_input = [$w('#propositiondate1'), $w('#propositionheure1'), $w('#propositiondate2'), $w('#propositionheure2'), $w('#propositiondate3'), $w('#propositionheure3')]
    let invalid = []
    for (let input of liste_input) {
        if (!input.value && input.required) {
            input.updateValidityIndication()
            $w('#msgVpSaveReserve').text = "​Veuillez saisir l'horaire du RDV"
            invalid.push(input)
        }
    }
    if (invalid.length == 0) {
        $w('#msgVpSaveReserve').hide()
        return true
    } else {
        $w('#msgVpSaveReserve').show()
        return false
    }
}

$w('#SaveReserv').onClick(async (event) => {
    $w('#SaveReserv').disable()
    $w('#SaveReserv').label = "En cours"
    let timeStr, dateStr
    let reservation = report
    let save = false

    if (!($w('#nesouhaite').label === "Je ne souhaite pas faire de contre-proposition")) {
        if (update_saveProposition()) {
            let all_propositionDate = [reservation.rdvDemand1, reservation.rdvDemand11, reservation.rdvDemand111]
            for (let [index, timeRdv] of timeRdvs.entries()) {
                if (timeRdv.value) {
                    dateStr = all_propositionDate[index]
                    timeStr = timeRdv.value
                    break;
                }
            }
            reservation.rdv = sum_date_hours(dateStr, timeStr)
            reservation.statut_reservation = "reserver"
            save = true
        }
    } else {
        if (update_saveContreProposition()) {
            let input_contre_proposition_date = [$w('#propositiondate1'), $w('#propositiondate2'), $w('#propositiondate3')]
            let input_contre_proposition_heure = [$w('#propositionheure1'), $w('#propositionheure2'), $w('#propositionheure3')]
            let all_contrepropositionDate = [reservation.contrepropositionDate1, reservation.contrepropositionDate2, reservation.contrepropositionDate3]
            for (let [index, input] of input_contre_proposition_date.entries()) {
                if (input.value) {
                    dateStr = await parseDate(await formatDate('' + input.value + ''))
                    timeStr = input_contre_proposition_heure[index].value
                    all_contrepropositionDate[index] = sum_date_hours(dateStr, timeStr)
                }
            }
            if ($w('#propositiondate1').value) {
                reservation.contrepropositionDate1 = all_contrepropositionDate[0]
            } else {
                reservation.contrepropositionDate1 = null
            }
            if ($w('#propositiondate2').value) {
                reservation.contrepropositionDate2 = all_contrepropositionDate[1]
            } else {
                reservation.contrepropositionDate2 = null
            }
            if ($w('#propositiondate3').value) {
                reservation.contrepropositionDate3 = all_contrepropositionDate[2]
            } else {
                reservation.contrepropositionDate3 = null
            }
            reservation.rdvDemand = false
            reservation.datePriseRdvClient = new Date()
            reservation.statut_reservation = "contreproposition"
            save = true
            for (let [index, contre_proposition_date] of input_contre_proposition_date.entries()) {
                for (let [index_verif, contre_proposition_date_verif] of input_contre_proposition_date.entries()) {
                    if ((contre_proposition_date.value && (input_contre_proposition_heure[index]).value) && (contre_proposition_date_verif.value && (input_contre_proposition_heure[index_verif]).value) && index !== index_verif) {
                        if ((new Date(contre_proposition_date.value)).getTime() === (new Date(contre_proposition_date_verif.value)).getTime() && (horaire_split((input_contre_proposition_heure[index]).value)).hours === (horaire_split((input_contre_proposition_heure[index_verif]).value)).hours) {
                            $w('#msgVpSaveReserve').text = "Créneau déjà sélectionné. Réessayez."
                            $w('#msgVpSaveReserve').show()
                            save = false
                        }
                    }
                }
            }
        }
    }
    if (save) {
        $w('#msgVpSaveReserve').hide()
        await updatereport(reservation)
        wixLocation.to('https://www.ciel-evasion.fr/partenaire')
    } else {
        $w('#SaveReserv').label = "Enregistrer mes disponibilités"
        $w('#SaveReserv').enable()
    }
})

function sum_date_hours(dateStr, timeStr) {
    let [year, month, day] = dateStr.split("-");
    let horaire_input = horaire_split(timeStr)
    return new Date(year, month - 1, day, horaire_input.hours, horaire_input.minutes, horaire_input.seconds);
}

function input_proposition_contre(proposition_type, type) {
    let input_proposition = [$w('#timeRdv1'), $w('#timeRdv2'), $w('#timeRdv3'), $w('#disponibl1'), $w('#disponibl2'), $w('#disponibl3')]
    let input_contre_proposition = [$w('#propositiondate1'), $w('#propositionheure1'), $w('#propositiondate2'), $w('#propositionheure2'), $w('#propositiondate3'), $w('#propositionheure3')]
    let proposition
    $w('#SaveReserv').disable()
    if (proposition_type === "proposition") {
        proposition = input_proposition
    } else if (proposition_type === "contre") {
        if (type === 'disable') {
            $w('#boxContreProposition').hide()
            $w('#boxContreProposition').collapse()
        } else if (type === 'enable') {
            $w('#boxContreProposition').show()
            $w('#boxContreProposition').expand()
        }
        proposition = input_contre_proposition
    }

    proposition.forEach((input, index) => {
        if (type === "enable") {
            input.enable()
        } else if (type === "disable") {
            if (proposition_type === "contre") {
                input.required = false
                input.value = null
            }
            input.disable()
        }
    });
}

function onChange_proposition_contre() {
    let input_contre_propositiondate = all_input_contre_propositiondate
    let input_contre_propositionheure = [$w('#propositionheure1'), $w('#propositionheure2'), $w('#propositionheure3')]
    input_contre_propositiondate.forEach((input, index) => {
        input.onChange(() => {
            if (input.value) {
                input.required = true;
                input_contre_propositionheure[index].required = true;
                $w('#SaveReserv').enable()
            }
            input.updateValidityIndication();
        });
    });
}

$w('#nesouhaite').onClick((event) => {
    $w('#msgVpSaveReserve').hide()
    if ($w('#nesouhaite').label === "Je ne souhaite pas faire de contre-proposition") {
        input_proposition_contre("contre", "disable")
        input_proposition_contre("proposition", "enable")
        $w('#nesouhaite').label = "Je souhaite faire une contre-proposition"
    } else {
        let all_disponible_check = disponibles
        for (let disponible_check of all_disponible_check) {
            if (disponible_check.checked) {
                disponible_check.checked = false
            }
            update_disponible(disponible_check)
        }
        input_proposition_contre("contre", "enable")
        input_proposition_contre("proposition", "disable")
        $w('#nesouhaite').label = "Je ne souhaite pas faire de contre-proposition"
    }
})

function update_disponible(item) {
    let all_disponible_check = disponibles
    let all_timeRdv = timeRdvs
    let i = 0
    let save = false
    for (let disponible_check of all_disponible_check) {
        if ((item.checked && item === disponible_check) || (item === all_timeRdv[i])) {
            disponible_check.checked = true
            all_timeRdv[i].value = null
            all_timeRdv[i].required = true
            save = true
        } else {
            disponible_check.checked = false
            all_timeRdv[i].value = null
            all_timeRdv[i].required = false
        }
        i++
        $w('#msgVpSaveReserve').hide()
    }
    if (save) {
        $w('#SaveReserv').enable()
    } else {
        $w('#SaveReserv').disable()
    }
}

function onFocus_onClick() {
    let all_onClick = disponibles
    let all_onFocus = timeRdvs
    for (let onClick of all_onClick) {
        onClick.onClick((event) => {
            update_disponible(onClick)
        })
    }
    for (let onFocus of all_onFocus) {
        onFocus.onFocus((event) => {
            update_disponible(onFocus)
        })
    }
}

$w.onReady(() => {
    console.log("Page is ready");

    const menuIcon = $w("#menuIcon");
    const contactButton = $w("#contact");
    let isPopupOpen = false;
    let isContactPopupOpen = false;

    menuIcon.onClick(() => {
        if (!isPopupOpen) {
            console.log("Ouverture de la Lightbox pour le menu");

            menuIcon.src = "https://static.wixstatic.com/media/5192e0_57c86f6707974178a298aed84188edb1~mv2.png";

            wixWindow.openLightbox("PopupMenuPartenaire").then(() => {
                console.log("Lightbox fermée");

                menuIcon.src = "https://static.wixstatic.com/media/5192e0_41600e96268b410897c950d1fcd579c1~mv2.png";
                isPopupOpen = false;
            });

            isPopupOpen = true;
        }
    });

    contactButton.onClick(() => {
        if (!isContactPopupOpen) {
            console.log("Ouverture de la Lightbox pour Contact");

            wixWindow.openLightbox("PopupContactPartenaire").then(() => {
                console.log("Lightbox de Contact fermée");
                isContactPopupOpen = false;
            });

            isContactPopupOpen = true;
        } else {
            console.log("Fermeture de la Lightbox pour Contact");
            wixWindow.lightbox.close()
            isContactPopupOpen = false;
        }
    });
});
//////////////////////////////////////

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
    mntContribution
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
    getAllReserv_encoursbyPartenaire,
    getAllReserv_enattentebyPartenaire,
    getAllReserv_reservebyPartenaire,
    getAllReserv_encours,
    getAllReserv_enattente,
    getAllReserv_reserve,
    getAllReserv_fact,
    getAllReserv_annul
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
    opt_reportByRef,
    formatage_date,
    capitalize,
    formatage_date_y_m_d,
    formatDate,
    french_formatPhone,
    parseDate,
    age,
    conversion_date,
    conversion_heure
} from 'backend/modules/data/tiny_function';
import {
    getAllProducts,
    getProductsById
} from 'backend/modules/services/products_services';
let member, ref, report, partenaire, allPartenaire, role, admin_name, partenaire_
let admin = false
let disponibles = [$w('#disponibl1'), $w('#disponibl2'), $w('#disponibl3')]
let timeRdvs = [$w('#timeRdv1'), $w('#timeRdv2'), $w('#timeRdv3')]
let all_input_contre_propositiondate = [$w('#propositiondate1'), $w('#propositiondate2'), $w('#propositiondate3')]
let drop_partenaireselect = $w('#partenaireselect')
let away = new Date()
away.setFullYear(1800)
let minDate = new Date()
minDate.setDate(minDate.getDate() + 2)

$w.onReady(async function () {
    const start = Date.now();
    $w('#boxPartenaireVoirPlus').hide()
    $w('#sectionMenu').hide()
    $w('#sectionFooter').hide()
    item_hide_show(drop_partenaireselect, "hide")
    let error = false
    let params = wixLocation.query;
    if (params.ref) {
        //member = await getMemberByEmail("contact@ciel-evasion.fr")
        [ref, member] = await Promise.all([
            ((params.ref)),
            wixMembers.currentMember.getMember().then((res) => { return res })
        ]);
        report = await getreportByRef(ref)
        if (report) {
            [role, partenaire, allPartenaire] = await Promise.all([
                wixMembers.currentMember.getRoles()
                .then((roles) => {
                    return roles.filter(r => r.title === "Admin" || r.title === "Owner" || r.title === "Partenaire");
                }),
                getPartenaireByemail(member.loginEmail),
                getAllPartenaire()
            ]);
            let session_id_partenaire = session.getItem("id_partenaire");
            if (session_id_partenaire) {
                partenaire = await getPartenaireById(session_id_partenaire)
            }
            let session_id_partenaire_admin = session.getItem("id_partenaire_admin");
            if (session_id_partenaire_admin) {
                admin_name = true
            }

            if (role.length > 0) {
                if (role[0].title === "Partenaire") {
                    if (admin_name) {

                        admin_name = false
                        session.removeItem("id_partenaire_admin");
                    }
                    partenaire_ = true
                } else if (role[0].title === "Admin" || role[0].title === "Owner") {
                    admin = true
                }
            }
            if (partenaire || admin || partenaire_) {
                if (!admin) {
                    item_hide_show(drop_partenaireselect, "hide")
                } else {
                    drop_input_insert(drop_partenaireselect, [...[{
                        title: "ADMIN",
                        _id: "admin_"
                    }], ...allPartenaire])
                    //drop_input_insert(drop_partenaireselect, allPartenaire)
                    item_hide_show(drop_partenaireselect, "show")
                }
                if (partenaire && partenaire.title) {
                    if (admin_name) {
                        $w("#titrePartenaire").text = "ADMIN"
                    } else {
                        $w("#titrePartenaire").text = partenaire.title
                    }
                }
                if ((admin && !partenaire) || partenaire_) {
                    let info_partenaire = await getMemberByEmail(member.loginEmail)
                    if (admin_name) {
                        $w("#titrePartenaire").text = "ADMIN"
                    } else {
                        $w("#titrePartenaire").text = info_partenaire.firstName
                    }
                }
                if (report.rdv || report.contrepropositionDate1 || report.contrepropositionDate2 || report.contrepropositionDate3 || partenaire_) {
                    wixLocation.to('https://www.ciel-evasion.fr/partenaire')
                } else {
                    await chargement(report)
                    $w('#boxPartenaireVoirPlus').show()
                    $w('#sectionMenu').show()
                    $w('#sectionFooter').show()
                }
            } else {
                error = true
            }
        } else {
            error = true
        }
    }
    if (error) {
        wixLocation.to('/')
    }
    const end = Date.now();
    console.log(`Partenaire voir plus a pris ${(end - start)/1000} s`);
});

drop_partenaireselect.onChange(async (event) => {
    let value = String(drop_partenaireselect.value)
    if (value) {
        if (value === "admin_") {
            $w("#titrePartenaire").text = "ADMIN"
            session.setItem("id_partenaire_admin", value);
        } else {
            partenaire = await getPartenaireById(value)
            session.setItem("id_partenaire", value);
            if (admin_name) {

                admin_name = false
                session.removeItem("id_partenaire_admin");
            }
            $w("#titrePartenaire").text = partenaire.title
        }
    }
})

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

function drop_input_insert(dropDown, all_data) {
    const options = all_data.map((item) => {
        return {
            label: item.title,
            value: item._id
        };
    });
    dropDown.options = options;
}

export async function chargement(report) {
    onFocus_onClick()
    onChange_proposition_contre()
    input_proposition_contre("contre", "disable")
    let [article, activite, ageClient, taille, dateDachat, contribution, opt] = await Promise.all([
        getProductsById(report.article),
        wixData.queryReferenced('Reports', report._id, 'activitetest').then(res => res.items[0]),
        age(report.date_de_naissance),
        convertirCmEnMetres(report.taille),
        conversion_date(report.validit),
        mntContribution(report),
        chaine_opt(report.ref)
    ]);
    let lieu = ''
    if (report.lieu) {
        lieu = " - à " + report.lieu
    }
    if (opt) {
        opt = "\n" + "\u00A0\u00A0\u00A0" + opt
    } else {
        opt = ""
    }
    let all_dispo = [$w("#dispo1"), $w("#dispo2"), $w("#dispo3")]
    let all_rdvDemand = [report.rdvDemand1, report.rdvDemand11, report.rdvDemand111]
    let all_choixHoraireDate = [report.choixHoraireDate1, report.choixHoraireDate2, report.choixHoraireDate3]
    const convertedDates = await Promise.all(
        all_rdvDemand.map(date => conversion_date(date))
    );
    all_dispo.forEach((dispo, i) => {
        dispo.html = `<span style="font-size:18px;">${convertedDates[i]}</span><span style="font-size:14px;">&nbsp; : &nbsp;${all_choixHoraireDate[i]}</span>`;
    });
    let all_input_disponibl = disponibles
    let all_input_timeRdv1 = timeRdvs
    let all_input_propositiondate = [$w('#propositiondate1'), $w('#propositiondate2'), $w('#propositiondate3')]
    for (let [index, input_propositiondate] of all_input_propositiondate.entries()) {
        input_propositiondate.minDate = minDate
        input_propositiondate.maxDate = new Date(new Date(report.validit))
        all_input_disponibl[index].checked = false
        all_input_timeRdv1[index].required = false
        all_input_timeRdv1[index].value = null
    }
    $w("#refTitre").text = "REF : " + report.ref
    $w("#titrVpEnattent").text = activite.title + " - " + article.name.slice(article.name.indexOf(': '), article.name.length).replace(': ', '') + lieu + opt
    $w("#imagVpEnattent").src = article.mainMedia
    $w("#infoParticip").text = report.prenom + " " + report.nom + " - " + ageClient + " ans - " + report.poids + " kg - " + "Taille " + taille
    $w("#dateDachat").text = dateDachat
    $w("#prix").text = report.prix + ' €'
    $w("#mntContribution").text = contribution + ' €'
    $w("#inforeservation").show()
    $w("#inforeservation").expand()
    $w("#infoReservation2").show()
    $w("#infoReservation2").expand()
}

function preference_horaire(horaire) {
    if (horaire === "Matin") {
        return { debut: [0, 0], fin: [12, 59] }
    } else if (horaire === "Après-midi") {
        return { debut: [13, 0], fin: [23, 59] }
    } else if (horaire === "Soir") {
        return { debut: [14, 0], fin: [23, 59] }
    } else if (horaire === "Sans préférence d'horaire") {
        return { debut: [0, 0], fin: [23, 59] }
    }
}

function horaire_split(horaire) {
    let [hours, minutes, seconds] = horaire.split(":");
    return { hours: Number(hours), minutes: Number(minutes), seconds: Number(seconds) }
}

function update_saveProposition() {
    let invalid = []
    let input_time = timeRdvs
    let reservation = report
    let all_horaire_rdv = [reservation.choixHoraireDate1, reservation.choixHoraireDate2, reservation.choixHoraireDate3]
    let i = 0
    for (let input of input_time) {
        if (input.required) {
            if (input.value) {
                let error_input = false
                let horaire_rdv = preference_horaire(all_horaire_rdv[i])
                let horaire_input = horaire_split(input.value)
                if (!((horaire_input.hours >= (horaire_rdv.debut)[0] && horaire_input.minutes >= (horaire_rdv.debut)[1]) &&
                        (horaire_input.hours <= (horaire_rdv.fin)[0] && horaire_input.minutes <= (horaire_rdv.fin)[1]))) {
                    error_input = true
                }
                if (all_horaire_rdv[i] === "Matin" && horaire_input.hours === 13 && horaire_input.minutes === 0) {
                    error_input = false
                }
                if (error_input) {
                    $w('#msgVpSaveReserve').text = "Vérifiez le créneau horaire du client"
                    invalid.push(input)
                }
            } else if (!input.value) {
                $w('#msgVpSaveReserve').text = "​Veuillez saisir l'horaire du RDV"
                invalid.push(input)
            }
        }
        i++
    }
    if (invalid.length == 0) {
        $w('#msgVpSaveReserve').hide()
        return true
    } else {
        $w('#msgVpSaveReserve').show()
        return false
    }
}

function update_saveContreProposition() {
    let liste_input = [$w('#propositiondate1'), $w('#propositionheure1'), $w('#propositiondate2'), $w('#propositionheure2'), $w('#propositiondate3'), $w('#propositionheure3')]
    let invalid = []
    for (let input of liste_input) {
        if (!input.value && input.required) {
            input.updateValidityIndication()
            $w('#msgVpSaveReserve').text = "​Veuillez saisir l'horaire du RDV"
            invalid.push(input)
        }
    }
    if (invalid.length == 0) {
        $w('#msgVpSaveReserve').hide()
        return true
    } else {
        $w('#msgVpSaveReserve').show()
        return false
    }
}

$w('#SaveReserv').onClick(async (event) => {
    $w('#SaveReserv').disable()
    $w('#SaveReserv').label = "En cours"
    let timeStr, dateStr
    let reservation = report
    let save = false

    if (!($w('#nesouhaite').label === "Je ne souhaite pas faire de contre-proposition")) {
        if (update_saveProposition()) {
            let all_propositionDate = [reservation.rdvDemand1, reservation.rdvDemand11, reservation.rdvDemand111]
            for (let [index, timeRdv] of timeRdvs.entries()) {
                if (timeRdv.value) {
                    dateStr = all_propositionDate[index]
                    timeStr = timeRdv.value
                    break;
                }
            }
            reservation.rdv = sum_date_hours(dateStr, timeStr)
            reservation.statut_reservation = "reserver"
            save = true
        }
    } else {
        if (update_saveContreProposition()) {
            let input_contre_proposition_date = [$w('#propositiondate1'), $w('#propositiondate2'), $w('#propositiondate3')]
            let input_contre_proposition_heure = [$w('#propositionheure1'), $w('#propositionheure2'), $w('#propositionheure3')]
            let all_contrepropositionDate = [reservation.contrepropositionDate1, reservation.contrepropositionDate2, reservation.contrepropositionDate3]
            for (let [index, input] of input_contre_proposition_date.entries()) {
                if (input.value) {
                    dateStr = await parseDate(await formatDate('' + input.value + ''))
                    timeStr = input_contre_proposition_heure[index].value
                    all_contrepropositionDate[index] = sum_date_hours(dateStr, timeStr)
                }
            }
            if ($w('#propositiondate1').value) {
                reservation.contrepropositionDate1 = all_contrepropositionDate[0]
            } else {
                reservation.contrepropositionDate1 = null
            }
            if ($w('#propositiondate2').value) {
                reservation.contrepropositionDate2 = all_contrepropositionDate[1]
            } else {
                reservation.contrepropositionDate2 = null
            }
            if ($w('#propositiondate3').value) {
                reservation.contrepropositionDate3 = all_contrepropositionDate[2]
            } else {
                reservation.contrepropositionDate3 = null
            }
            reservation.rdvDemand = false
            reservation.datePriseRdvClient = new Date()
            reservation.statut_reservation = "contreproposition"
            save = true
            for (let [index, contre_proposition_date] of input_contre_proposition_date.entries()) {
                for (let [index_verif, contre_proposition_date_verif] of input_contre_proposition_date.entries()) {
                    if ((contre_proposition_date.value && (input_contre_proposition_heure[index]).value) && (contre_proposition_date_verif.value && (input_contre_proposition_heure[index_verif]).value) && index !== index_verif) {
                        if ((new Date(contre_proposition_date.value)).getTime() === (new Date(contre_proposition_date_verif.value)).getTime() && (horaire_split((input_contre_proposition_heure[index]).value)).hours === (horaire_split((input_contre_proposition_heure[index_verif]).value)).hours) {
                            $w('#msgVpSaveReserve').text = "Créneau déjà sélectionné. Réessayez."
                            $w('#msgVpSaveReserve').show()
                            save = false
                        }
                    }
                }
            }
        }
    }
    if (save) {
        $w('#msgVpSaveReserve').hide()
        await updatereport(reservation)
        wixLocation.to('https://www.ciel-evasion.fr/partenaire')
    } else {
        $w('#SaveReserv').label = "Enregistrer mes disponibilités"
        $w('#SaveReserv').enable()
    }
})

function sum_date_hours(dateStr, timeStr) {
    let [year, month, day] = dateStr.split("-");
    let horaire_input = horaire_split(timeStr)
    return new Date(year, month - 1, day, horaire_input.hours, horaire_input.minutes, horaire_input.seconds);
}

function input_proposition_contre(proposition_type, type) {
    let input_proposition = [$w('#timeRdv1'), $w('#timeRdv2'), $w('#timeRdv3'), $w('#disponibl1'), $w('#disponibl2'), $w('#disponibl3')]
    let input_contre_proposition = [$w('#propositiondate1'), $w('#propositionheure1'), $w('#propositiondate2'), $w('#propositionheure2'), $w('#propositiondate3'), $w('#propositionheure3')]
    let proposition
    $w('#SaveReserv').disable()
    if (proposition_type === "proposition") {
        proposition = input_proposition
    } else if (proposition_type === "contre") {
        if (type === 'disable') {
            $w('#boxContreProposition').hide()
            $w('#boxContreProposition').collapse()
        } else if (type === 'enable') {
            $w('#boxContreProposition').show()
            $w('#boxContreProposition').expand()
        }
        proposition = input_contre_proposition
    }

    proposition.forEach((input, index) => {
        if (type === "enable") {
            input.enable()
        } else if (type === "disable") {
            if (proposition_type === "contre") {
                input.required = false
                input.value = null
            }
            input.disable()
        }
    });
}

function onChange_proposition_contre() {
    let input_contre_propositiondate = all_input_contre_propositiondate
    let input_contre_propositionheure = [$w('#propositionheure1'), $w('#propositionheure2'), $w('#propositionheure3')]
    input_contre_propositiondate.forEach((input, index) => {
        input.onChange(() => {
            if (input.value) {
                input.required = true;
                input_contre_propositionheure[index].required = true;
                $w('#SaveReserv').enable()
            }
            input.updateValidityIndication();
        });
    });
}

$w('#nesouhaite').onClick((event) => {
    $w('#msgVpSaveReserve').hide()
    if ($w('#nesouhaite').label === "Je ne souhaite pas faire de contre-proposition") {
        input_proposition_contre("contre", "disable")
        input_proposition_contre("proposition", "enable")
        $w('#nesouhaite').label = "Je souhaite faire une contre-proposition"
    } else {
        let all_disponible_check = disponibles
        for (let disponible_check of all_disponible_check) {
            if (disponible_check.checked) {
                disponible_check.checked = false
            }
            update_disponible(disponible_check)
        }
        input_proposition_contre("contre", "enable")
        input_proposition_contre("proposition", "disable")
        $w('#nesouhaite').label = "Je ne souhaite pas faire de contre-proposition"
    }
})

function update_disponible(item) {
    let all_disponible_check = disponibles
    let all_timeRdv = timeRdvs
    let i = 0
    let save = false
    for (let disponible_check of all_disponible_check) {
        if ((item.checked && item === disponible_check) || (item === all_timeRdv[i])) {
            disponible_check.checked = true
            all_timeRdv[i].value = null
            all_timeRdv[i].required = true
            save = true
        } else {
            disponible_check.checked = false
            all_timeRdv[i].value = null
            all_timeRdv[i].required = false
        }
        i++
        $w('#msgVpSaveReserve').hide()
    }
    if (save) {
        $w('#SaveReserv').enable()
    } else {
        $w('#SaveReserv').disable()
    }
}

function onFocus_onClick() {
    let all_onClick = disponibles
    let all_onFocus = timeRdvs
    for (let onClick of all_onClick) {
        onClick.onClick((event) => {
            update_disponible(onClick)
        })
    }
    for (let onFocus of all_onFocus) {
        onFocus.onFocus((event) => {
            update_disponible(onFocus)
        })
    }
}

$w.onReady(() => {
    console.log("Page is ready");

    const menuIcon = $w("#menuIcon");
    const contactButton = $w("#contact");
    let isPopupOpen = false;
    let isContactPopupOpen = false;

    menuIcon.onClick(() => {
        if (!isPopupOpen) {
            console.log("Ouverture de la Lightbox pour le menu");

            menuIcon.src = "https://static.wixstatic.com/media/5192e0_57c86f6707974178a298aed84188edb1~mv2.png";

            wixWindow.openLightbox("PopupMenuPartenaire").then(() => {
                console.log("Lightbox fermée");

                menuIcon.src = "https://static.wixstatic.com/media/5192e0_41600e96268b410897c950d1fcd579c1~mv2.png";
                isPopupOpen = false;
            });

            isPopupOpen = true;
        }
    });

    contactButton.onClick(() => {
        if (!isContactPopupOpen) {
            console.log("Ouverture de la Lightbox pour Contact");

            wixWindow.openLightbox("PopupContactPartenaire").then(() => {
                console.log("Lightbox de Contact fermée");
                isContactPopupOpen = false;
            });

            isContactPopupOpen = true;
        } else {
            console.log("Fermeture de la Lightbox pour Contact");
            wixWindow.lightbox.close()
            isContactPopupOpen = false;
        }
    });
});