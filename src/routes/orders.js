import express from "express";
import { get_all_order} from "../controllers/ordersController.js";

const router = express.Router();

// GET all Orders
///https://ciel-evasion-backend.vercel.app/api/orders/getAllOrders
router.get("/getAllOrders", get_all_order);

export default router;
