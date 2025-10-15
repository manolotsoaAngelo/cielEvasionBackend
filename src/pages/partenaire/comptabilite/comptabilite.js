//import { validNbon_onClick } from '../pages/partenaire/comptabilite/comptabilite.js';


export async function validNbon_onClick() {
   return validNbon.onClick(async (event) => {
        if (allNbon.value) {
            messageError.hide()
            validNbon.disable()
            let liste_bon = (allNbon.value).split(/[\s,]+/).filter(Boolean);
            await chargement(liste_bon)
            validNbon.enable()
        } else {
            messageError.text = "Une erreur est survenue"
            messageError.show()
        }
    })
}