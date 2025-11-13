import express from "express";
import {
  get_all_ebillet,
  get_All_Ebillet_Facture_ByPartenaire,
} from "../controllers/ebilletsController.js";

const router = express.Router();

// GET all Ebillets
router.get("/getAllEbillets", get_all_ebillet);

router.post(
  "/get_All_Ebillet_Facture_ByPartenaire",
  get_All_Ebillet_Facture_ByPartenaire
);

export default router;