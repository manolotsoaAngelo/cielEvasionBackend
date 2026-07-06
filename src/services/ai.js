import { GoogleGenAI } from "@google/genai";
//import dotenv from 'dotenv';
//dotenv.config();

class AiService {
    constructor() {
        this.ai = new GoogleGenAI({});
    }

    async clean_input_client_by_Ai(input) {
        let result = (JSON.parse((await this.AiGemini(await this.Ai_text_to_text(input))).replace(/```json/g, "")
            .replace(/```/g, "")
            .trim()))
        console.log("Result AI prediction Nom Prenom: ", result)
        return result;
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
        const models = [
            "gemini-3.5-flash",
            "gemini-2.5-flash",
            "gemini-3-flash-preview",
            "gemini-2.0-flash",
            "gemini-2.0-flash-lite",
            "gemini-flash-latest"
        ];

        let lastError = null;

        for (const model of models) {
            try {
                const response = await (await this.ai).models.generateContent({
                    model: model,
                    contents: content,
                });
                return response.text;
            } catch (error) {
                console.warn(`[AI Service] Échec avec le modèle ${model}, tentative avec le modèle suivant... Erreur:`, error.message || error);
                lastError = error;
            }
        }

        throw new Error(`Tous les modèles Gemini ont échoué. Dernière erreur: ${lastError?.message || lastError}`);
    }
}

export default new AiService();
