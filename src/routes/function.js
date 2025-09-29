import express from "express";
import { runFunction} from "../controllers/functionController.js";

const router = express.Router();

// GET all Ebillets
//https://ciel-evasion-backend.vercel.app/getAllEbillets
//router.get("/getAllEbillets", getEbillets);

// POST new Ebillets
router.post("/runFunction", runFunction);

export default router;
