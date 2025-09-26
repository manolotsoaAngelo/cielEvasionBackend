import { tri_reportByASC_ref } from '../utils/crud/function.js';
import { compressed_obj, decompressed_obj } from '../utils/compression/compression.js'

export async function getEbillets(req, res) {
    const response = await fetch("https://ciel-evasion.fr/_functions/myFunction/all_ebillet", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const result = await response.json();
    res.json(decompressed_obj(result.data));
}

export async function tri_reportByASC_ref_Ebillets(req, res) {
    const { data } = (req.body);
    if (!data) return res.status(400).json({ error: "données requis" });

    const response = await fetch("https://ciel-evasion.fr/_functions/myFunction/findMe", {
        method: "GET", // ou "POST" selon ton endpoint
        headers: {
            "Content-Type": "application/json"
        }
    });

    const result = await response.json();
    //let all_ebillet = decompressed_obj(data)
    //const newEbillets = { id: Date.now(), text };
    //Ebilletss.push(newEbillets);
    //res.json(decompressed_obj(data));
    res.status(201).json(result);
}
