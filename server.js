import express from "express";
import fetch from "node-fetch"; // si besoin pour renvoyer des données à Wix

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Route qui reçoit un message depuis Wix
app.post("/from-wix", (req, res) => {
  const { message } = req.body;
  console.log("📩 Message reçu de Wix:", message);

  // Exemple : répondre directement à Wix
  res.json({ reply: `Node.js a bien reçu: ${message}` });
});

// Exemple : Node.js envoie un message vers Wix
app.post("/to-wix", async (req, res) => {
  const wixUrl = "https://tonsite.wixsite.com/_functions/receiveMessage"; 
  // ⚠️ route backend Wix (fonction web exposée)

  const response = await fetch(wixUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Hello depuis Node.js 🚀" })
  });

  const data = await response.json();
  res.json({ status: "OK", wixReply: data });
});

app.listen(PORT, () => {
  console.log(`✅ Node.js API sur http://localhost:${PORT}`);
});
