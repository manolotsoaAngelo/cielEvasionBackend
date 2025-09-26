import express from "express";
import { getreservation,tri_reportByASC_ref_reservation} from "../controllers/reservationController.js";

const router = express.Router();

// GET all reservation
//https://ciel-evasion-backend.vercel.app/getAllreservation
router.get("/getAllreservation", getreservation);

// POST new reservation
router.post("/tri_reportByASC_ref", tri_reportByASC_ref_reservation);

export default router;
