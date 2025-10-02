import express from "express";
import ebilletsRoutes from "./src/routes/ebillets.js";
import reservationController from "./src/routes/reservation.js";
import functionController from "./src/routes/function.js";
import ordersController from "./src/routes/orders.js";
import membersController from "./src/routes/orders.js";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.send("404 not found");
});

app.use("/api/ebillets", ebilletsRoutes);
app.use("/api/reservation", reservationController);
app.use("/api/members", membersController);
app.use("/api/function", functionController);
app.use("/api/orders", ordersController);


app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
