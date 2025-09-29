import express from "express";
import { getAllOrders} from "../controllers/ordersController.js";

const router = express.Router();

// GET all Orders
//https://ciel-evasion-backend.vercel.app/getAllOrders
router.get("/getAllOrders", getAllOrders);

export default router;
