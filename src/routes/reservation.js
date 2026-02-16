import express from "express";
import {
  get_all_reservation,
  get_reservation_ContrePropositionByIdebillet,
  get_reservation_ContrePropositionByIdpartenaire,
  get_all_reservation_ContreProposition,
  get_all_reservation_byPartenaire,
  get_all_reservation_enattente,
  get_reservation_enattenteByIdebillet,
  get_all_reservation_enattenteByIdpartenaire,
  get_all_reservation_reserver,
  get_all_reservation_reserverByIdpartenaire,
  get_reservation_reserverByIdebillet,
} from "../controllers/reservationController.js";

const router = express.Router();

// GET all reservation
///https://ciel-evasion-backend.vercel.app/api/reservation/getAllreservation
router.get("/getAllreservation", get_all_reservation);
router.get("/get_all_reservation_enattente", get_all_reservation_enattente);
router.get("/getAllreservation_reserver", get_all_reservation_reserver);
router.get("/getAllreservation_ContreProposition", get_all_reservation_ContreProposition);

router.post("/get_reservation_reserverByIdebillet", get_reservation_reserverByIdebillet);
router.post("/get_all_reservation_reserverByIdpartenaire", get_all_reservation_reserverByIdpartenaire);
router.post("/get_reservation_enattenteByIdebillet", get_reservation_enattenteByIdebillet);
router.post("/get_all_reservation_enattenteByIdpartenaire", get_all_reservation_enattenteByIdpartenaire);
router.post("/get_reservation_ContrePropositionByIdebillet", get_reservation_ContrePropositionByIdebillet);
router.post("/get_reservation_ContrePropositionByIdpartenaire", get_reservation_ContrePropositionByIdpartenaire);
router.post("/get_all_reservation_byPartenaire", get_all_reservation_byPartenaire);

export default router;