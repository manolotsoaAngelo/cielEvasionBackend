import express from "express";
import { get_css_partenaires_header_footer_body_fix,get_css_importateur_header_fix} from "../controllers/cssController.js";

const router = express.Router();

// GET all css_partenaires
///https://ciel-evasion-backend.vercel.app/api/css/get_css_partenaires_header_footer_body_fix
router.get("/get_css_partenaires_header_footer_body_fix", get_css_partenaires_header_footer_body_fix);
router.get("/get_css_importateur_header_fix", get_css_importateur_header_fix);

export default router;