import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors()); // permet à Wix d'appeler ton serveur
app.use(express.json());

// Stockage en mémoire (simple exemple)
let messages = [];

// Route pour recevoir un message de Wix
app.post("/api/message", (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Message requis" });

  const newMessage = { id: Date.now(), text };
  messages.push(newMessage);

  console.log("📩 Nouveau message reçu :", newMessage);
  res.status(201).json(newMessage);
});

// Route pour renvoyer les messages à Wix
app.get("/api/messages", (req, res) => {
  res.json(messages);
});

app.listen(PORT, () => {
  console.log(`✅ Serveur Node.js démarré sur http://localhost:${PORT}`);
});
