import express from "express";
import ebilletsRoutes from "./src/routes/ebillets.js";
import reservationController from "./src/routes/reservation.js";
import functionController from "./src/routes/function.js";
import ordersController from "./src/routes/orders.js";
import partenairesController from "./src/routes/partenaires.js";
import usersController from "./src/routes/users.js";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.json({ limit: "10mb" }));

app.get("/ping", (req, res) => res.json({ status: "ok" }));
app.get("/", (req, res) => {
  res.redirect(301, "https://ciel-evasion.fr/");
});

app.use("/api/ebillets", ebilletsRoutes);
app.use("/api/reservation", reservationController);
app.use("/api/function", functionController);
app.use("/api/orders", ordersController);
app.use("/api/partenaires", partenairesController);
app.use("/api/users", usersController);

app.use((req, res) => {
  res.redirect(301, "https://ciel-evasion.fr/");
});

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
