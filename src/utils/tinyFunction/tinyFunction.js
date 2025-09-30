import { all_ebillet,get_ebilletById,get_ebilletByRef } from '../../services/ebillets.js';
import { all_order,get_orderById } from '../../services/orders.js';

console.log(await opt_reportByRef("E10917-2"))
console.log(await chaine_opt_partenaire("E10917-2"))
console.log(await chaine_opt("E10917-2"))

export async function chaine_opt_partenaire(ref) {
    let liste_option = await opt_reportByRef(ref)
    if (liste_option) {
        return ((liste_option).filter(a => !(a.option).includes('OFFERT'))).map(item => `${item.option} : ${item.selection}`).join(', ');
    } else {
        return null
    }
}

export async function chaine_opt(ref) {
    let liste_option = await opt_reportByRef(ref)
    if (liste_option) {
        return liste_option.map(item => `${item.option} : ${item.selection}`).join(', ');
    } else {
        return null
    }
}

export async function opt_reportByRef(ref) {
    let opt = []
    let report = await get_ebilletByRef(ref)
    if (report.commande) {
        let commande = await get_orderById(report.commande)
        let i = 0
        for (let lineItems of commande.lineItems) {
            if (lineItems.productId === report.article) {
                let allItems = commande.lineItems[i].options
                allItems = allItems.map((a, index) => ({
                    option: a.option,
                    selection: a.selection,
                    _id: `id-${Date.now()}-${index}`
                }));

                let opt_array = ["Tarif", "adulte", "enfant", "Avion", "Pilote", "Report", "100%", "Garanties", "Échanges", "E-Billet", "Validité", "Billet"]
                for (const it of allItems) {
                    let opt_test = false
                    for (const option_arr of opt_array) {
                        if ((JSON.stringify(it)).toLowerCase().includes(option_arr.toLowerCase())) {
                            opt_test = true
                        }
                    }
                    if (!opt_test) {
                        it.selection = it.selection.replace(/\s*\(.*\)/, "");
                        await opt.push(it)
                    }
                }
                return await Promise.all(opt)
            }
            i++
        }
    } else {
        return null
    }
}