import { compressed_obj, decompressed_obj } from '../utils/compression/compression.js'
import {
    all_reservation,
    reservation_ContrePropositionByIdebillet,
    reservation_ContrePropositionByIdpartenaire,
    all_reservation_ContreProposition,
    all_reservation_FullData,
    all_reservation_byPartenaire
} from '../services/reservation.js';

export async function get_all_reservation_byId(req, res) {
    let value = req
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
    let all_reservation_data = await all_reservation_ContreProposition();
    res.json(compressed_obj(all_reservation_data));
}

export async function get_all_reservation(req, res) {
    let all_reservation_data = await all_reservation();
    res.json(compressed_obj(all_reservation_data));
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
