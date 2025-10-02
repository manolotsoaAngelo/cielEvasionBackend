import express from "express";
import { get_all_reservation} from "../controllers/reservationController.js";

const router = express.Router();

// GET all reservation

router.get("/getAllreservation", get_all_reservation);

export default router;
