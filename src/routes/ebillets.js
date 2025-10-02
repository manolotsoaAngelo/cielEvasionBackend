import express from "express";
import { get_all_ebillet} from "../controllers/ebilletsController.js";

const router = express.Router();

// GET all Ebillets

router.get("/getAllEbillets", get_all_ebillet);

export default router;
