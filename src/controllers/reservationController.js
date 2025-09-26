import { tri_reportByASC_ref } from '../utils/crud/function.js';
import { compressed_obj, decompressed_obj } from '../utils/compression/compression.js'
import { all_reservation } from '../services/reservation.js';

export async function getreservation(req, res) {
    let all_reservation_data = decompressed_obj(await all_reservation());
    
    res.json(all_reservation_data);
}

export async function tri_reportByASC_ref_reservation(req, res) {
    const { data } = (req.body);
    if (!data) return res.status(400).json({ error: "données requis" });

    const response = await fetch("https://ciel-evasion.fr/_functions/myFunction/findMe", {
        method: "GET", // ou "POST" selon ton endpoint
        headers: {
            "Content-Type": "application/json"
        }
    });

    const result = await response.json();
    //let all_reservation = decompressed_obj(data)
    //const newreservation = { id: Date.now(), text };
    //reservations.push(newreservation);
    //res.json(decompressed_obj(data));
    res.status(201).json(result);
}
