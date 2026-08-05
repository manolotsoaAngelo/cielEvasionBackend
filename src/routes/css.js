import express from "express";
import {
    post_facture_comptabilite_css,
    get_css_partenaires_header_footer_body_fix
    , get_css_importateur_header_fix
    , get_avis_Client_full_body,
    get_section_admin_hauteux_max,
    get_pop_rdv_css
} from "../controllers/cssController.js";

const router = express.Router();

// GET all css_partenaires
///https://ciel-evasion-backend.vercel.app/api/css/get_css_partenaires_header_footer_body_fix

router.get("/get_pop_rdv_css", get_pop_rdv_css);
router.post("/post_facture_comptabilite_css", post_facture_comptabilite_css);
router.get("/get_css_partenaires_header_footer_body_fix", get_css_partenaires_header_footer_body_fix);
router.get("/get_css_importateur_header_fix", get_css_importateur_header_fix);
router.get("/get_avis_Client_full_body", get_avis_Client_full_body);
router.get("/get_section_admin_hauteux_max", get_section_admin_hauteux_max);


export default router;