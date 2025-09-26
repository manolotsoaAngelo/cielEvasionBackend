import express from "express";
import { getAllreservation} from "../controllers/reservationController.js";

const router = express.Router();

// GET all reservation
//https://ciel-evasion-backend.vercel.app/getAllreservation
router.get("/getAllreservation", getAllreservation);

export default router;
