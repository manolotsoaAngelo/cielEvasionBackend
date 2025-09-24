import express from "express";

const app = express();
app.use(express.json());

let messages = [];

// POST message
app.post("/api/message", (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Message requis" });

  const newMessage = { id: Date.now(), text };
  messages.push(newMessage);
  res.status(201).json(newMessage);
});

// GET messages
app.get("/api/messages", (req, res) => {
  res.json(messages);
});

// ❌ Ne PAS mettre app.listen()
// ✅ Exporter l'app pour Vercel
export default app;
