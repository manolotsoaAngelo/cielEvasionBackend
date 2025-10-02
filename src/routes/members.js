import express from "express";
import { get_all_members} from "../controllers/membersController.js";

const router = express.Router();

// GET all Members

router.get("/getAllMembers", get_all_members);

export default router;
