import express from "express";
import { runFunction} from "../controllers/functionController.js";

const router = express.Router();

// POST new Function

router.post("/runFunction", runFunction);

export default router;