import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import placeRoutes from "./routes/place.js";
import scheduleRoutes from "./routes/schedule.js";

const app = express();
const port = Number.parseInt(process.env.PORT, 10) || 3000;

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((url) => url.trim())
  : ["http://localhost:5173", "http://localhost:5174"];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "API do Vayra rodando" });
});

app.use("/places", placeRoutes);
app.use("/schedules", scheduleRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Rota não encontrada" });
});

app.use((error, req, res, next) => {
  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(" "), errors: messages });
  }
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ message: "JSON inválido" });
  }

  console.error(error);
  res.status(500).json({ message: "Erro interno no servidor" });
});

await connectDB();
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
