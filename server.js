import express from "express";
import ebilletsRoutes from "./src/routes/ebillets.js";
import reservationController from "./src/routes/reservation.js";
import functionController from "./src/routes/function.js";
import ordersController from "./src/routes/orders.js";
import partenairesController from "./src/routes/partenaires.js";
import usersController from "./src/routes/users.js";

import { init_cachedData_ebillet } from "../utils/fullData/ebillets.js";
import { init_cachedData_orders } from "../utils/fullData/orders.js";
import { init_cachedData_partenaire } from "../utils/fullData/partenaires.js";
import { init_cachedData_users } from "../utils/fullData/users.js";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.json({ limit: "10mb" }));

(async () => {
  init_cachedData_ebillet();
  init_cachedData_orders();
  init_cachedData_partenaire();
  init_cachedData_users();
})();

app.get("/", (req, res) => {
  res.redirect(301, "https://ciel-evasion.fr/");
});

app.get("/ping", (req, res) => {
  function formatDuration(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}h ${m}m ${s}s`;
  }

  res.status(200).json({
    status: "ok",
    uptime: formatDuration(process.uptime()),
    timestamp: new Date().toLocaleString("fr-FR", {
      timeZone: "Indian/Antananarivo",
    }),
  });
});

app.get("/health", async (req, res) => {
  try {
    res.status(200).json({ healthy: true });
  } catch (err) {
    res.status(500).json({ healthy: false, error: err.message });
  }
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
