import express from "express";
import { get_css_partenaires } from "../controllers/cssController.js";

const router = express.Router();

// GET all css_partenaires
///https://ciel-evasion-backend.vercel.app/api/partenaires/get_css_partenaires
router.get("/get_css_partenaires", get_css_partenaires);

export default router;