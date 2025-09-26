import express from "express";
import ebilletsRoutes from "./src/routes/ebillets.js";
import reservationController from "./src/routes/reservation.js";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.send("404 not found");
});

app.use("/api/ebillets", ebilletsRoutes);
app.use("/api/reservation", reservationController);



/*
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

*/

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
