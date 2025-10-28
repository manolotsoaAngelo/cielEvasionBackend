
//import ReservationService from '../services/reservation.js';

import {
  tri_reportByASC_ref,
  tri_ebilletByASC_ref,
  tri_ebilletByASC_Date,
  tri_ebilletByDEC_Date_Byrdv,
  create_order_new
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
    return tri_ebilletByDEC_Date_Byrdv(reserver(await this.getAll()));
  }
  async getAllReservationEnattente() {
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