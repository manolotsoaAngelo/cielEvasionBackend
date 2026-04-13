import wixData from 'wix-data';
import wixStorage from 'wix-storage';
import { fetch } from 'wix-fetch';
import { getUrl, _getUrl } from 'backend/getUrl'
import { get_activation_iframe, set_activation_iframe } from 'backend/private/function/function';
import { generation_commande } from 'backend/modules/services/orders_services';
import { fonction_maj } from 'backend/public/function/function'
import {
    getAllMember,
    getMemberByEmail,
    getMemberById,
    addMember_everyone,
    delete_Member_everyone,
    email_contact_By_member,
    getAllMember_everyone,
    verif_Member_everyone,
    member_everyone
} from 'backend/modules/services/membre_services';
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
    conversion_date_ago,
    normalizeString,
    getDatePrevisionFacturation_lundi
} from 'backend/modules/data/tiny_function';
import {
    getAllProducts,getProductsById,getProduct_byPartenaire,getProduct_byCielEvasion
} from 'backend/modules/services/products_services';
import { getAllreport, getreportByRef, updatereport, delete_bonDchange, addreport } from 'backend/modules/services/reports_services';
import { crypter, decrypter } from 'backend/modules/fonctionnalites/information/cryptographie'
import { compressed_obj, decompressed_obj } from 'backend/modules/fonctionnalites/information/compression'
import { services_post, services_get, pingServer, get_url_real_time_maj_backend } from 'backend/modules/server/server'

let realTimeMajAPI = $w('#realTimeMajAPI');

let button_maj = $w('#maj');
let button_iframe = $w('#buttoniframe');

let drop_article = $w('#dropdownArticle')
let datevalidite = $w('#datePickerDatevalidite')
let dateRdv = $w('#datePickerDateRdv')
let heureRdv = $w('#timePickerHeureRdv')
let uploadBondEchange = $w('#uploadButtonBondEchange')
let email_ = $w('#emailBenef')
let tel_ = $w('#teL')
let numebillet_ = $w('#numEbillet')
let categorie = $w('#categ')
let prenom_ = $w('#prenoM')
let nom_ = $w('#noM')
let tarif_ = $w('#tariF')
let numero = $w('#numerO')
let msg_error = $w('#msgebilletgenerr')
let txtValidite = $w('#validite');
let datedenaissance_ = $w('#datedenaissance');
let datedenaissanceholder_ = $w('#datedenaissanceholder');
let poids_ = $w('#poids');
let taille_ = $w('#taille');
let option_ = $w('#checkboxOption');
let savereport = $w('#savereportButton')

const NBSP = "\u00A0";

let all_input_gen = [
    dateRdv,
    heureRdv,
    numero,
    datevalidite,
    email_,
    tel_,
    numebillet_,
    drop_article,
    prenom_,
    nom_,
    tarif_,
    categorie
]

$w.onReady(async function () {
    let start = Date.now();
    savereport.disable()
    let now = new Date();

    dateRdv.minDate = now;
    dateRdv.resetValidityIndication();
    dateRdv.blur();

    datedenaissance_.maxDate = new Date((now.getFullYear() - 6), now.getMonth(), now.getDate());
    datedenaissance_.resetValidityIndication();
    datedenaissance_.blur();
    datedenaissanceholder_.hide();

    calculerValidite();
    set_drop_recherche();
    button_maj.label = "Mis à jour disponible";
    button_maj.style.backgroundColor = '#4CAF50';
    await updateIframeButton();

    realTimeMajAPI.src = String(await atob(await get_url_real_time_maj_backend()))

    let end = Date.now();
    console.log(`page admin a pris ${(end - start)/1000} s`);
});

datevalidite.onChange(() => {
    calculerValidite();
});

datedenaissance_.onChange(async () => {
    if (datedenaissance_.value) {
        let ageCalcule = await age(datedenaissance_.value);
        datedenaissance_.label = `Âge : ${ageCalcule} ans`;
    }
});

tel_.onChange(async (event) => {
    tel_.value = await french_formatPhone(tel_.value)
});

numebillet_.onBlur(() => {
    numebillet_.value = (numebillet_.value).toUpperCase()
});

prenom_.onBlur(async () => {
    prenom_.value = await capitalize(prenom_.value)
});

nom_.onBlur(() => {
    nom_.value = (nom_.value).toUpperCase()
});

tarif_.onChange(async (event) => {
    let tarif = tarif_.value
    if (tarif) {
        savereport.disable()
        let categ = await wixData.query('GROUPES').find().then((res) => { return res.items.filter(a => Number(a.entre) <= Number(tarif)).filter(a => Number(a.et) >= Number(tarif))[0] })
        categorie.value = categ.title
        savereport.enable()
    } else {
        savereport.disable()
    }
});

savereport.onClick(async (event) => {
    for (let input of all_input_gen) {
        input.required = true
    }
    let error_input = false
    let all_input_gen_verif = [
        dateRdv.value,
        heureRdv.value,
        numero.value,
        datevalidite.value,
        email_.valid,
        tel_.value,
        numebillet_.value,
        drop_article.value,
        prenom_.value,
        nom_.value,
        tarif_.value,
        categorie.value
    ]

    for (let input of all_input_gen_verif) {
        if (!input) {
            error_input = true
        }
    }

    if (!error_input) {
        savereport.disable()
        savereport.label = "En cours"
        let ref = categorie.value + numebillet_.value + '-' + numero.value
        let doublons = await getreportByRef(ref)
        if (!doublons) {
            msg_error.hide()
            let report = {}
            report.lieu11 = email_.value
            report.lieu111 = tel_.value
            report.ref = ref
            report.nom = (nom_.value).toUpperCase()
            report.prenom = prenom_.value
            report.article = String(drop_article.value)
            report.prix = Number(tarif_.value)
            report.url_ebillet = "https://www.ciel-evasion.fr/mes-billets?ref_annul_meteo=" + ref;
            report.url_Annulation_Meteo = "https://www.ciel-evasion.fr/impression-e-billet?ref=" + ref;
            let er = false,
                libert = false,
                nb_er = 0;
            for (let list of option_.value) {
                if (list === "er") {
                    er = true;
                    nb_er = 1;
                } else if (list === "liberte") {
                    libert = true;
                }
            }
            report.souscription = er;
            report.libert = libert;
            report.nb_er = nb_er;

            if (datedenaissance_.value) {
                report.date_de_naissance = await parseDate(await formatDate('' + datedenaissance_.value + ''))
            }
            if (poids_.value) {
                report.poids = Number(poids_.value);
            }
            if (taille_.value) {
                report.taille = Number((taille_.value).replace(/[.,]/g, ""));
            }

            let date_validite = new Date(datevalidite.value)
            let month = (date_validite.getMonth() + 1).toString().padStart(2, '0');
            let day = date_validite.getDate().toString().padStart(2, '0');

            report.validit = date_validite.getFullYear() + '-' + month + '-' + day
            report.dateDachat = (date_validite.getFullYear() - 1) + '-' + month + '-' + day
            report.statut_reservation = "reserver";
            report.datePriseRdvClient = new Date()

            let d = dateRdv.value;
            let yStr = d.getFullYear();
            let mStr = (d.getMonth() + 1).toString().padStart(2, '0');
            let dStr = d.getDate().toString().padStart(2, '0');
            let dateString = `${yStr}-${mStr}-${dStr}`;

            report.rdv = sum_date_hours(dateString, heureRdv.value);
            report.nb_rdv = Number(1)

            if ((uploadBondEchange.value).length > 0) {
                await uploadBondEchange.uploadFiles().then(async (uploadedFiles) => {
                    report.bonDchange = uploadedFiles[0].fileUrl
                })
            }

            await addreport(report)
            await fonction_maj();

            for (let input of all_input_gen) {
                input.value = null;
                input.required = false;
                input.resetValidityIndication();
            }

            numero.value = "1"

            if (datedenaissance_.value) {
                datedenaissance_.label = "Âge"
                datedenaissance_.value = null
            }
            if (poids_.value) {
                poids_.value = null
            }
            if (taille_.value) {
                taille_.value = null
            }

            uploadBondEchange.reset();
            uploadBondEchange.resetValidityIndication();
            txtValidite.text = "";
        } else {
            msg_error.text = "E-billet existant";
            msg_error.show()
            savereport.enable()
        }
    } else {
        for (let input of all_input_gen) { input.updateValidityIndication(); }
        uploadBondEchange.updateValidityIndication();
        msg_error.text = "Une erreur est survenue";
        msg_error.show()
        savereport.enable()
    }
    savereport.label = "Génération"
})

function calculerValidite() {
    const dateSelectionnee = datevalidite.value;
    const aujourdhui = new Date();
    aujourdhui.setHours(0, 0, 0, 0);

    if (dateSelectionnee) {
        const dateFin = new Date(dateSelectionnee);
        dateFin.setHours(0, 0, 0, 0);
        const diffMs = dateFin.getTime() - aujourdhui.getTime();
        const diffJours = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        const absJours = Math.abs(diffJours);

        let formatDuree = "";
        if (absJours >= 365) {
            const ans = Math.floor(absJours / 365);
            const jours = absJours % 365;
            formatDuree = `${ans} an${ans > 1 ? 's' : ''}${jours > 0 ? ' + ' + jours + ' j' : ''}`;
        } else {
            formatDuree = `${absJours} j`;
        }

        if (diffJours > 0) {
            txtValidite.text = `${NBSP}${NBSP}Valide (${formatDuree})${NBSP}${NBSP}`;
            txtValidite.style.color = "#27AE60";
        } else if (diffJours === 0) {
            txtValidite.text = `${NBSP}${NBSP}Expire aujourd'hui${NBSP}${NBSP}`;
            txtValidite.style.color = "#E67E22";
        } else {
            txtValidite.text = `${NBSP}${NBSP}Périmé (${formatDuree})${NBSP}${NBSP}`;
            txtValidite.style.color = "#C0392B";
        }
    } else {
        txtValidite.text = "";
    }
}

function horaire_split(horaire) {
    if (!horaire) return { hours: 0, minutes: 0, seconds: 0 };
    let parts = horaire.split(":");
    return { hours: Number(parts[0]) || 0, minutes: Number(parts[1]) || 0, seconds: Number(parts[2]) || 0 };
}

function sum_date_hours(dateStr, timeStr) {
    if (!dateStr || !timeStr) return null;
    let [year, month, day] = dateStr.split("-");
    let horaire_input = horaire_split(timeStr)
    return new Date(Number(year), Number(month) - 1, Number(day), horaire_input.hours, horaire_input.minutes, horaire_input.seconds);
}

async function updateIframeButton() {
    let state = await get_activation_iframe();
    if (state === 'enabled') {
        button_iframe.label = 'Iframe Activé';
        button_iframe.style.backgroundColor = '#4CAF50';
    } else {
        button_iframe.label = 'Iframe Désactivé';
        button_iframe.style.backgroundColor = '#F44336';
    }
}

async function set_drop_recherche() {
    let all_product = await getProduct_byCielEvasion();
    drop_article.options = all_product.map((item) => { return { label: item.name, value: item._id }; });
}

button_maj.onClick(async () => {
    button_maj.label = "En cours";
    await fonction_maj();
    button_maj.label = "Mis à jour éffectué";
    setTimeout(() => { button_maj.label = "Mis à jour disponible" }, 5000);
});

button_iframe.onClick(async () => {
    let currentState = await get_activation_iframe();
    let newState = currentState === 'enabled' ? 'disabled' : 'enabled';
    await set_activation_iframe(newState);
    await updateIframeButton();
});

/*
import wixData from 'wix-data';
import wixStorage from 'wix-storage';
import { getUrl, _getUrl } from 'backend/getUrl'
import { get_activation_iframe, set_activation_iframe } from 'backend/private/function/function';
import { generation_commande } from 'backend/modules/services/orders_services';
import { fonction_maj } from 'backend/public/function/function'
import {
    getAllMember,
    getMemberByEmail,
    getMemberById,
    addMember_everyone,
    delete_Member_everyone,
    email_contact_By_member,
    getAllMember_everyone,
    verif_Member_everyone,
    member_everyone
} from 'backend/modules/services/membre_services';
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
    conversion_date_ago,
    normalizeString,
    getDatePrevisionFacturation_lundi
} from 'backend/modules/data/tiny_function';
import { getAllProducts } from 'backend/modules/services/products_services';
import { getAllreport, getreportByRef, updatereport, delete_bonDchange, addreport } from 'backend/modules/services/reports_services';
import { crypter, decrypter } from 'backend/modules/fonctionnalites/information/cryptographie'
import { compressed_obj, decompressed_obj } from 'backend/modules/fonctionnalites/information/compression'

let button_maj = $w('#maj');
let button_iframe = $w('#buttoniframe');
let drop_article = $w('#article')
let datevalidite = $w('#datevalidite')
let dateRdv = $w('#dateRdv')
let heureRdv = $w('#heureRdv')
let uploadBondEchange = $w('#uploadBondEchange')
let email_ = $w('#email')
let tel_ = $w('#tel')
let numebillet_ = $w('#numebillet')
let prenom_ = $w('#prenom')
let nom_ = $w('#nom')
let tarif_ = $w('#tarif')
let numero = $w('#numero')
let categorie = $w('#categorie')
let msg_error = $w('#msgebilletgen')

let all_input_gen = [
    dateRdv,
    heureRdv,
    numero,
    datevalidite,
    dateRdv,
    heureRdv,
    email_,
    tel_,
    numebillet_,
    drop_article,
    prenom_,
    nom_,
    tarif_,
    categorie
]

let savereport = $w('#savereport')

$w.onReady(async function () {

    let start = Date.now();
    savereport.disable()
    let now = new Date();
    let now_date = new Date(
        now.getFullYear() + 1,
        now.getMonth(),
        now.getDate()
    )
    dateRdv.minDate = now
    set_drop_recherche()
    button_maj.label = "Mis à jour disponible";
    button_maj.style.backgroundColor = '#4CAF50';
    await updateIframeButton();

    let end = Date.now();
    console.log(`page admin a pris ${(end - start)/1000} s`);

});

function horaire_split(horaire) {
    let [hours, minutes, seconds] = horaire.split(":");
    return { hours: Number(hours), minutes: Number(minutes), seconds: Number(seconds) }
}

function sum_date_hours(dateStr, timeStr) {
    let [year, month, day] = dateStr.split("-");
    let horaire_input = horaire_split(timeStr)
    return new Date(year, month - 1, day, horaire_input.hours, horaire_input.minutes, horaire_input.seconds);
}

function maj_drop(all_product) {
    let options_all_product = all_product.map((item) => {
        return {
            label: item.name,
            value: item._id
        };
    });
    drop_article.options = options_all_product;
}

async function set_drop_recherche() {
    maj_drop(await getAllProducts())
}

tel_.onChange(async (event) => {
    tel_.value = await french_formatPhone(tel_.value)
})

numebillet_.onKeyPress((event) => {
    numebillet_.value = (numebillet_.value).toUpperCase()
})

prenom_.onKeyPress(async (event) => {
    prenom_.value = await capitalize(prenom_.value)
})

nom_.onKeyPress((event) => {
    nom_.value = (nom_.value).toUpperCase()
})

tarif_.onChange(async (event) => {
    let tarif = tarif_.value
    if (tarif) {
        savereport.disable()
        let categ = await wixData.query('GROUPES').find().then((res) => { return res.items.filter(a => Number(a.entre) <= Number(tarif)).filter(a => Number(a.et) >= Number(tarif))[0] })
        $w('#categorie').value = categ.title
        savereport.enable()
    }
})

savereport.onClick(async (event) => {

    savereport.label = "En cours"
    uploadBondEchange.required = true
    for (let input of all_input_gen) {
        input.required = true
    }
    let error_input = false
    let error_ = []
    let all_input_gen_verif = [
        (uploadBondEchange.value).length > 0,
        dateRdv.value,
        heureRdv.value,
        numero.value,
        datevalidite.value,
        dateRdv.value,
        heureRdv.value,
        email_.valid,
        tel_.value,
        numebillet_.value,
        drop_article.value,
        prenom_.value,
        nom_.value,
        tarif_.value,
        categorie.value
    ]
    for (let input of all_input_gen_verif) {
        if (!input) {
            error_input = true
            error_.push(input)
        }
    }

    //console.log(error_)

    if (!error_input) {
        let ref = categorie.value + numebillet_.value + '-' + numero.value
        let doublons = await getreportByRef(ref)
        if (!doublons) {
            msg_error.hide()
            let prix = tarif_.value
            let prenom = prenom_.value
            let nom = nom_.value
            let option = $w('#option')
            let email_benef = email_.value
            let telephone = tel_.value
            let er = false
            let libert = false
            let nb_er = Number(0)

            for (let list of option.value) {
                if (list === "er") {
                    er = true
                    nb_er = Number(1)
                } else if (list === "liberte") {
                    libert = true
                }
            }

            let report = {}
            report.lieu11 = email_benef
            report.lieu111 = telephone
            report.ref = ref
            report.nom = nom
            report.prenom = prenom
            report.article = String(drop_article.value)
            report.souscription = er
            report.nb_er = nb_er
            report.libert = libert
            report.prix = Number(prix)
            report.nb_rdv = Number(0)
            report.url_ebillet = "https://www.ciel-evasion.fr/mes-billets?ref_annul_meteo=" + ref
            report.url_Annulation_Meteo = "https://www.ciel-evasion.fr/impression-e-billet?ref=" + ref

            let date_validite = new Date(datevalidite.value)
            let month = (date_validite.getMonth() + 1).toString().padStart(2, '0');
            let day = date_validite.getDate().toString().padStart(2, '0');

            report.validit = date_validite.getFullYear() + '-' + month + '-' + day
            report.dateDachat = (date_validite.getFullYear() - 1) + '-' + month + '-' + day
            report.statut_reservation = "reserver"
            report.datePriseRdvClient = new Date()
            report.rdv = sum_date_hours(await parseDate(await formatDate(String(dateRdv.value))), heureRdv.value)

            let bonDchange
            await uploadBondEchange.uploadFiles()
                .then(async (uploadedFiles) => {
                    bonDchange = uploadedFiles[0].fileUrl
                })
            report.bonDchange = bonDchange
            //console.log(report)

            await addreport(report).then(async (res) => {
                console.log(res)
            }).catch((err) => {
                console.log(err)
            })

            uploadBondEchange.required = false
            uploadBondEchange.reset()
            for (let input of all_input_gen) {
                input.required = false
                input.value = null
            }
        } else {
            msg_error.text = "E-billet existant"
            msg_error.show()
        }

    } else {
        dateRdv.updateValidityIndication()
        heureRdv.updateValidityIndication()
        uploadBondEchange.updateValidityIndication()
        numero.updateValidityIndication()
        datevalidite.updateValidityIndication()
        dateRdv.updateValidityIndication()
        heureRdv.updateValidityIndication()
        email_.updateValidityIndication()
        tel_.updateValidityIndication()
        numebillet_.updateValidityIndication()
        drop_article.updateValidityIndication()
        prenom_.updateValidityIndication()
        nom_.updateValidityIndication()
        tarif_.updateValidityIndication()
        msg_error.text = "​Une erreur est survenue"
        msg_error.show()
    }

    setTimeout(async () => {
        savereport.label = "Génération"
    }, 5 * 1000);
    await fonction_maj()
})

$w('#appliquer').onClick(async (event) => {

    $w('#appliquer').label = "En cours"

    let ebillet = $w('#ebillet').value
    let prolongationER = $w('#prolongationER')

    let non_perime = false
    let er = false
    let perime = false

    for (let list of prolongationER.value) {
        if (list === "er") {
            er = true
        } else if (list === "non_perime") {
            non_perime = true
        } else if (list === "perime") {
            perime = true
        }
    }

    let data = {
        ebillet: ebillet,
        non_perime: non_perime,
        er: er,
        perime: perime
    };
    let resultat
    if (ebillet && (er && !perime && !non_perime || (!er && !perime && non_perime) || (!er && !non_perime && perime))) {
        resultat = await generation_commande(data)
        console.log(resultat)
        if (resultat) {
            $w('#appliquer').label = "Efféctué"
            $w('#message').hide()
        } else {
            $w('#message').show()
        }
    } else {
        $w('#message').show()
    }
    $w('#appliquer').label = "Génération"
})

button_maj.onClick(async () => {
    button_maj.label = "En cours";
    button_maj.style.backgroundColor = '#FFC107';
    await fonction_maj();
    button_maj.label = "Mis à jour éffectué";
    button_maj.style.backgroundColor = '#F44336';
    setTimeout(async () => {
        button_maj.label = "Mis à jour disponible";
        button_maj.style.backgroundColor = '#4CAF50';
    }, 5 * 1000);
    //await member_everyone()
});

button_iframe.onClick(async () => {
    button_iframe.label = "En cours";
    button_iframe.style.backgroundColor = '#FFC107';
    let currentState = await get_activation_iframe();
    let newState = currentState === 'enabled' ? 'disabled' : 'enabled';
    await set_activation_iframe(newState);
    await updateIframeButton();
});

// Mise à jour du bouton "Iframe"
async function updateIframeButton() {
    let state = await get_activation_iframe();
    if (state === 'enabled') {
        button_iframe.label = 'Iframe Activé';
        button_iframe.style.backgroundColor = '#4CAF50'; // Vert
    } else if (state === 'disabled') {
        button_iframe.label = 'Iframe Désactivé';
        button_iframe.style.backgroundColor = '#F44336'; // Rouge
    } else {
        console.warn('État inconnu:', state);
        button_iframe.label = 'État Inconnu';
        button_iframe.style.backgroundColor = '#FFC107'; // Jaune
    }
}

*/