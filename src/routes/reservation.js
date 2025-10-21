import express from "express";
import {
    get_all_reservation
    , get_reservation_ContrePropositionByIdebillet, 
    get_reservation_ContrePropositionByIdpartenaire,
    get_all_reservation_ContreProposition,
    get_all_reservation_byPartenaire
} from "../controllers/reservationController.js";

const router = express.Router();

// GET all reservation
///https://ciel-evasion-backend.vercel.app/api/reservation/getAllreservation
router.get("/getAllreservation", get_all_reservation);
router.get("/getAllreservation_ContreProposition", get_all_reservation_ContreProposition);
router.post("/get_reservation_ContrePropositionByIdebillet", get_reservation_ContrePropositionByIdebillet);
router.post("/get_reservation_ContrePropositionByIdpartenaire", get_reservation_ContrePropositionByIdpartenaire);
router.post("/get_all_reservation_byPartenaire", get_all_reservation_byPartenaire);

export default router;
