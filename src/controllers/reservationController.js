import { compressed_obj, decompressed_obj } from '../utils/compression/compression.js'
import {
    all_reservation,
    reservation_ContrePropositionByIdebillet,
    reservation_ContrePropositionByIdpartenaire,
    all_reservation_ContreProposition,
    all_reservation_byPartenaire,
    all_reservation_enattente,
    reservation_enattenteByIdebillet,
    reservation_enattenteByIdpartenaire,
    all_reservation_reserver,
    reservation_reserverByIdebillet,
    reservation_reserverByIdpartenaire

} from '../services/reservation.js';

export async function get_reservation_reserverByIdebillet(req, res) {
    let value = post(req, res)
    let result = await reservation_reserverByIdebillet(value._id)
    res.status(201).json(compressed_obj(result));
}

export async function get_all_reservation_reserverByIdpartenaire(req, res) {
    let value = post(req, res)
    let result = await reservation_reserverByIdpartenaire(value._id)
    res.status(201).json(compressed_obj(result));
}


export async function get_all_reservation_reserver(req, res) {
    let result = await all_reservation_reserver()
    res.json(compressed_obj(result));
}

export async function get_all_reservation_enattenteByIdpartenaire(req, res) {
    let value = post(req, res)
    let result = await reservation_enattenteByIdpartenaire(value._id)
    res.status(201).json(compressed_obj(result));
}

export async function get_reservation_enattenteByIdebillet(req, res) {
    let value = post(req, res)
    let result = await reservation_enattenteByIdebillet(value._id)
    res.status(201).json(compressed_obj(result));
}

export async function get_all_reservation_enattente(req, res) {
    let result = await all_reservation_enattente()
    res.json(compressed_obj(result));
}

export async function get_all_reservation_byId(req, res) {
    let value = post(req, res)
    let result = await all_reservation_byPartenaire(value._id)
    res.status(201).json(compressed_obj(result));
}

export async function get_all_reservation_byPartenaire(req, res) {
    let value = post(req, res)
    let result = await all_reservation_byPartenaire(value._id)
    res.status(201).json(compressed_obj(result));
}

export async function get_reservation_ContrePropositionByIdebillet(req, res) {
    postById(req, res, "ebillet")
}

export async function get_reservation_ContrePropositionByIdpartenaire(req, res) {
    postById(req, res, "partenaire")
}

export async function get_all_reservation_ContreProposition(req, res) {
    let result = await all_reservation_ContreProposition();
    res.json(compressed_obj(result));
}

export async function get_all_reservation(req, res) {
    let result = await all_reservation();
    res.json(compressed_obj(result));
}

function post(req, res) {
    const { data } = (req.body);
    if (!data) return res.status(400).json({ error: "données requis" });
    return decompressed_obj(data)
}

async function postById(req, res, type) {
    let value = post(req, res)
    let result
    if (type === "partenaire") {
        result = await reservation_ContrePropositionByIdpartenaire(value._id)
    } else if (type === "ebillet") {
        result = await reservation_ContrePropositionByIdebillet(value._id)
    }
    res.status(201).json(compressed_obj(result));
}
