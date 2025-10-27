
//import ReservationService from '../services/reservation.js';

import {
  tri_reportByASC_ref,
  tri_ebilletByASC_ref,
  tri_ebilletByASC_Date,
  tri_ebilletByDEC_Date_Byrdv,
} from "../utils/crud/function.js";

import EbilletsService from "../services/ebillets.js";

function enattente(data) {
  return data.filter(
    (item) =>
      item.statut_reservation === "en attente" && item.datePriseRdvClient
  );
}

function reserver(data) {
  return data.filter(
    (item) =>
      item.rdv_sup_now === true && item.statut_reservation === "reserver"
  );
}

function contreProposition(data) {
  return data.filter(
    (item) =>
      item.statut_reservation === "reserver" &&
      !item.rdv &&
      (item.contrepropositionDate1 ||
        item.contrepropositionDate2 ||
        item.contrepropositionDate3)
  );
}

function reservation(data) {
  let all_contreProposition = contreProposition(data);
  let all_reserver = reserver(data);
  let all_enattente = enattente(data);
  let result = [...all_contreProposition, ...all_reserver, ...all_enattente];
  return tri_ebilletByASC_ref(result);
}

class ReservationService {
  constructor() {
    this.data = [];
    this._initPromise = this._init();
  }

  async _init() {
    this.data = reservation(await EbilletsService.getAll());
  }
  async getAll() {
    await this._initPromise;
    return this.data;
  }

  async getAllReservationReserver() {
    await this._initPromise;
    return tri_ebilletByDEC_Date_Byrdv(reserver(await this.getAll()));
  }
  async getAllReservationEnattente() {
    await this._initPromise;
    return tri_ebilletByDEC_Date_Byrdv(enattente(await this.getAll()));
  }
  async getAllReservationContreProposition() {
    return tri_ebilletByASC_Date(contreProposition(await this.getAll()));
  }
  async getAllReservationByPartenaire(id_partenaire) {
    return reservation(
      await EbilletsService.getAllEbilletByPartenaire(id_partenaire)
    );
  }

  async getAllReservationReserverByIdpartenaire(id_partenaire) {
    return tri_ebilletByDEC_Date_Byrdv(
      reserver(await this.getAllReservationByPartenaire(id_partenaire))
    );
  }
  async getAllReservationEnattenteByIdpartenaire(id_partenaire) {
    return tri_ebilletByASC_Date(
      enattente(await this.getAllReservationByPartenaire(id_partenaire))
    );
  }
  async getAllReservationContrePropositionByIdpartenaire(id_partenaire) {
    return tri_ebilletByASC_Date(
      contreProposition(await this.getAllReservationByPartenaire(id_partenaire))
    );
  }

  async getReservationReserverByIdebillet(id) {
    return (await this.getAllReservationReserver()).find(
      (item) => item._id === id
    );
  }
  async getReservationEnattenteByIdebillet(id) {
    return (await this.getAllReservationEnattente()).find(
      (item) => item._id === id
    );
  }
  async getReservationContrePropositionByIdebillet(id) {
    return (await this.getAllReservationContreProposition()).find(
      (item) => item._id === id
    );
  }
}

export default new ReservationService();

//console.log(await all_reservation_ContreProposition())
//console.log(await reservation_ContrePropositionByIdpartenaire("15d9204a-b1d1-4288-8e5e-24e0fde1b8d3"))
//console.log(await reservation_ContrePropositionByIdebillet("9d2f2b55-6ddb-48f6-98b3-94a2955331408d2bb6bf-74fd-4666-8dfb-8e0876346cb3D10742-11"))
//console.log(await all_reservation_byPartenaire("15d9204a-b1d1-4288-8e5e-24e0fde1b8d3"))
//console.log(await all_reservation())
//console.log(await all_reservation_reserver())
//console.log(await reservation_reserverByIdebillet("9d2f2b55-6ddb-48f6-98b3-94a2955331408d2bb6bf-74fd-4666-8dfb-8e0876346cb3D10742-11"))
//console.log(await reservation_reserverByIdpartenaire("15d9204a-b1d1-4288-8e5e-24e0fde1b8d3"))
//console.log(await reservation_enattenteByIdpartenaire("15d9204a-b1d1-4288-8e5e-24e0fde1b8d3"))
//console.log(await reservation_enattenteByIdebillet("9d2f2b55-6ddb-48f6-98b3-94a2955331408d2bb6bf-74fd-4666-8dfb-8e0876346cb3D10742-11"))
//console.log(await all_reservation_enattente())

/*
export async function reservation_reserverByIdebillet(id) {
    return (await all_reservation_reserver()).find(item => item._id === id)
}
export async function reservation_reserverByIdpartenaire(id) {
    return tri_ebilletByDEC_Date_Byrdv(reserver(await all_reservation_byPartenaire(id)))
}

export async function all_reservation_reserver() {
    return tri_ebilletByDEC_Date_Byrdv(reserver(await all_reservation()))
}

export async function reservation_enattenteByIdpartenaire(id) {
    return tri_ebilletByASC_Date(enattente(await all_reservation_byPartenaire(id)))
}

export async function reservation_enattenteByIdebillet(id) {
    return (await all_reservation_enattente()).find(item => item._id === id)
}

export async function all_reservation_enattente() {
    return tri_ebilletByASC_Date(enattente(await all_reservation()))
}

export async function all_reservation() {
    return reservation(await all_ebillet_FullData())
}

export async function all_reservation_byPartenaire(id_partenaire) {
    return reservation(await get_All_ebilletByPartenaire(id_partenaire))
}

function reservation(data) {
    let all_contreProposition = contreProposition(data)
    let all_reserver = reserver(data)
    let all_enattente = enattente(data)
    let result = [...all_contreProposition, ...all_reserver, ...all_enattente]
    return tri_ebilletByASC_ref(result)
}

export async function reservation_ContrePropositionByIdebillet(id) {
    return (contreProposition(await all_ebillet_FullData())).find(item => item._id === id)
}

export async function reservation_ContrePropositionByIdpartenaire(id_partenaire) {
    return tri_ebilletByASC_Date(contreProposition(await get_All_ebilletByPartenaire(id_partenaire)))
}

export async function all_reservation_ContreProposition() {
    return tri_ebilletByASC_Date(contreProposition(await all_ebillet_FullData()))
}
function enattente(data) {
    return data.filter(item => (
        item.statut_reservation === "en attente" && item.datePriseRdvClient
    ));
}

function reserver(data) {
    return data.filter(item => (
        item.rdv_sup_now === true && item.statut_reservation === "reserver"
    ));
}

function contreProposition(data) {
    return data.filter(item => (
        item.statut_reservation === "reserver" &&
        !item.rdv &&
        (item.contrepropositionDate1 || item.contrepropositionDate2 || item.contrepropositionDate3)
    ));
}
*/
