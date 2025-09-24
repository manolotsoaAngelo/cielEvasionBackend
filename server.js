import express from "express"; // si tu es en ES6
// ou const express = require("express"); si CommonJS

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Exemple route GET
app.get("/api/hello", (req, res) => {
  res.json({ message: "Salut depuis mon backend Node.js 🚀" });
});

// Exemple route POST
app.post("/api/data", (req, res) => {
  const data = req.body;
  res.json({ received: data });
});

app.listen(PORT, () => {
  console.log(`Serveur Node.js en marche sur http://localhost:${PORT}`);
});
