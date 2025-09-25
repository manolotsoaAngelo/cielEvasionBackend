import { tri_reportByASC_ref } from '../utils/crud/function.js';
import { compressed_obj, decompressed_obj } from '../utils/compression/compression.js'

let Ebilletss = []; // Mémoire (tu peux remplacer par DB ou fichier)

export function getEbillets(req, res) {
    res.json(Ebilletss);
}

export async function tri_reportByASC_ref_Ebillets(req, res) {
    //const { data } = (req.body);
    //if (!data) return res.status(400).json({ error: "données requis" });

    const response = await fetch("https://ciel-evasion.fr/_functions/myFunction/findMe", {
        method: "GET", // ou "POST" selon ton endpoint
        headers: {
            "Content-Type": "application/json"
        }
    });

    const data = await response.json();
    let all_ebillet = decompressed_obj(data)
    //const newEbillets = { id: Date.now(), text };
    //Ebilletss.push(newEbillets);
    //res.json(decompressed_obj(data));
    res.status(201).json(compressed_obj(tri_reportByASC_ref(all_ebillet)));
}
