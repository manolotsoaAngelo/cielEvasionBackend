import express from "express";
import { get_all_ebillet} from "../controllers/ebilletsController.js";

const router = express.Router();

// GET all Ebillets
//https://ciel-evasion-backend.vercel.app/api/ebillets/getAllEbillets
router.get("/getAllEbillets", get_all_ebillet);

export default router;
