import express from "express";
import {
    get_codejs_load_page,
    get_css_partenaires_header_footer_body_fix
    , get_css_importateur_header_fix
    , get_avis_Client_full_body
} from "../controllers/cssController.js";

const router = express.Router();

// GET all css_partenaires
///https://ciel-evasion-backend.vercel.app/api/css/get_css_partenaires_header_footer_body_fix
router.get("/get_css_partenaires_header_footer_body_fix", get_css_partenaires_header_footer_body_fix);
router.get("/get_css_importateur_header_fix", get_css_importateur_header_fix);
router.get("/get_avis_Client_full_body", get_avis_Client_full_body);
router.get("/get_codejs_load_page", get_codejs_load_page);

export default router;