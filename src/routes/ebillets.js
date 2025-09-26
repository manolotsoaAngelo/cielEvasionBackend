import express from "express";
import { getEbillets,tri_reportByASC_ref_Ebillets} from "../controllers/ebilletsController.js";

const router = express.Router();

// GET all Ebillets
//https://ciel-evasion-backend.vercel.app/getAllEbillets
router.get("/getAllEbillets", getEbillets);

// POST new Ebillets
router.post("/tri_reportByASC_ref", tri_reportByASC_ref_Ebillets);

export default router;
