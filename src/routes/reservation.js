import express from "express";
import { get_all_reservation} from "../controllers/reservationController.js";

const router = express.Router();

// GET all reservation
///https://ciel-evasion-backend.vercel.app/api/reservation/getAllreservation
router.get("/getAllreservation", get_all_reservation);

export default router;
