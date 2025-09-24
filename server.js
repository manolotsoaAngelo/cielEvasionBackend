// Importation d'Express
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour lire du JSON dans les requêtes POST
app.use(express.json());

// Route GET simple
app.get("/", (req, res) => {
  res.send("Bienvenue sur m API Node.js 🚀");
});

// Route GET avec données JSON
app.get("/api/users", (req, res) => {
  res.json([
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ]);
});

// Route POST pour ajouter un utilisateur
app.post("/api/users", (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Le champ 'name' est requis" });
  }
  res.status(201).json({ id: Date.now(), name });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
