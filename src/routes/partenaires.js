import express from "express";
import { get_all_partenaire } from "../controllers/partenairesController.js";

const router = express.Router();

// GET all partenaires
///https://ciel-evasion-backend.vercel.app/api/partenaires/getAllpartenaires
router.get("/getAllpartenaires", get_all_partenaire);

export default router;