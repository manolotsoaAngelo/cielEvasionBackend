import { compressed_obj, decompressed_obj } from '../utils/compression/compression.js'

import ReservationService from '../services/reservation.js';

//console.log(await ReservationService.getAllReservationReserver());
//console.log(await ReservationService.getAll())
//console.log(await ReservationService.getAllReservationEnattente())
//console.log(await ReservationService.getAllReservationContreProposition())
//console.log(await ReservationService.getAllReservationContrePropositionByIdpartenaire("15d9204a-b1d1-4288-8e5e-24e0fde1b8d3"))
//console.log(await ReservationService.getReservationContrePropositionByIdebillet("9d2f2b55-6ddb-48f6-98b3-94a2955331408d2bb6bf-74fd-4666-8dfb-8e0876346cb3D10742-11"))
//console.log(await ReservationService.getAllReservationByPartenaire("15d9204a-b1d1-4288-8e5e-24e0fde1b8d3"))
//console.log(await ReservationService.getReservationReserverByIdebillet("9d2f2b55-6ddb-48f6-98b3-94a2955331408d2bb6bf-74fd-4666-8dfb-8e0876346cb3D10742-11"))
//console.log(await ReservationService.getAllReservationReserverByIdpartenaire("15d9204a-b1d1-4288-8e5e-24e0fde1b8d3"))
//console.log(await ReservationService.getAllReservationEnattenteByIdpartenaire("15d9204a-b1d1-4288-8e5e-24e0fde1b8d3"))
//console.log(await ReservationService.getReservationEnattenteByIdebillet("9d2f2b55-6ddb-48f6-98b3-94a2955331408d2bb6bf-74fd-4666-8dfb-8e0876346cb3D10742-11"))

export async function get_reservation_reserverByIdebillet(req, res) {
    let value = post(req, res)
    let result = await ReservationService.getReservationReserverByIdebillet(value._id)
    res.status(201).json(compressed_obj(result));
}

export async function get_all_reservation_reserverByIdpartenaire(req, res) {
    let value = post(req, res)
    let result = await ReservationService.getAllReservationReserverByIdpartenaire(value._id)
    res.status(201).json(compressed_obj(result));
}

export async function get_all_reservation_reserver(req, res) {
    let result = await ReservationService.getAllReservationReserver()
    res.json(compressed_obj(result));
}

export async function get_all_reservation_enattenteByIdpartenaire(req, res) {
    let value = post(req, res)
    let result = await ReservationService.getAllReservationEnattenteByIdpartenaire(value._id)
    res.status(201).json(compressed_obj(result));
}

export async function get_reservation_enattenteByIdebillet(req, res) {
    let value = post(req, res)
    let result = await ReservationService.getReservationEnattenteByIdebillet(value._id)
    res.status(201).json(compressed_obj(result));
}

export async function get_all_reservation_enattente(req, res) {
    let result = await ReservationService.getAllReservationEnattente()
    res.json(compressed_obj(result));
}

export async function get_all_reservation_byId(req, res) {
    let value = post(req, res)
    let result = await ReservationService.getAllReservationById(value._id)
    res.status(201).json(compressed_obj(result));
}

export async function get_all_reservation_byPartenaire(req, res) {
    let value = post(req, res)
    let result = await ReservationService.getAllReservationByPartenaire(value._id)
    res.status(201).json(compressed_obj(result));
}

export async function get_reservation_ContrePropositionByIdebillet(req, res) {
    postById(req, res, "ebillet")
}

export async function get_reservation_ContrePropositionByIdpartenaire(req, res) {
    postById(req, res, "partenaire")
}

export async function get_all_reservation_ContreProposition(req, res) {
    let result = await ReservationService.getAllReservationContreProposition();
    res.json(compressed_obj(result));
}

export async function get_all_reservation(req, res) {
    let result = await ReservationService.getAll();
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
        result = await ReservationService.getAllReservationContrePropositionByIdpartenaire(value._id)
    } else if (type === "ebillet") {
        result = await ReservationService.getReservationContrePropositionByIdebillet(value._id)
    }
    res.status(201).json(compressed_obj(result));
}