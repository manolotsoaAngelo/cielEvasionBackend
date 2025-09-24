import express from "express";
import { getEbillets,pushEbillets} from "../controllers/ebilletsController.js";

const router = express.Router();

// GET all messages
router.get("/", getEbillets);

// POST new message
router.post("/", pushEbillets);

export default router;
