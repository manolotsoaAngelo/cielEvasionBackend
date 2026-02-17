import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();

class AiService {
    constructor() {
        this.ai = new GoogleGenAI({});
    }

    async clean_input_client_by_Ai(input) {
        return (JSON.parse((await this.AiGemini(await this.Ai_text_to_text(input))).replace(/```json/g, "")
            .replace(/```/g, "")
            .trim()))
    }

    async Ai_text_to_text(value) {
        return `Dans : ${value}, extrait chaque personne et crée une variable JSON structurée contenant :
    - nom en MAJUSCULE
    - prenom capitalisé (Première lettre en majuscule, reste en minuscule)
    - age en nombre
    - poids en nombre
    
    Retourne UNIQUEMENT un tableau JSON valide exploitable directement en backend.
    Aucun texte, aucune explication, aucun commentaire.
    Format attendu :
    
    [
      {
        "nom": "NOM",
        "prenom": "Prenom",
        "age": 00,
        "poids": 00
      }
    ]
    `
    }

    async AiGemini(content) {
        const response = await (await this.ai).models.generateContent({
            model: "gemini-2.5-flash-lite-preview-09-2025",
            contents: content,
        });
        return response.text;
    }
}

export default new AiService();
