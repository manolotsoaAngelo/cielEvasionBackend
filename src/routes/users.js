import express from "express";
import { get_all_users,
    get_userByEmail,
    get_userById
 } from "../controllers/usersController.js";

const router = express.Router();

// GET all Users
///https://ciel-evasion-backend.vercel.app/api/users/getAllUsers
router.get("/getAllUsers", get_all_users);
router.post("/getUserByEmail", get_userByEmail);
router.post("/getUserById", get_userById);

export default router;