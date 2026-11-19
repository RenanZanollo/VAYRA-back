import "dotenv/config"; // carrega o .env ANTES de qualquer coisa usar process.env
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import placeRoutes from "./routes/place.js";
import scheduleRoutes from "./routes/schedule.js";

const app = express();
// parseInt pega só o número ("3000;" -> 3000). No Render, a PORT vem da própria plataforma.
const port = Number.parseInt(process.env.PORT, 10) || 3000;

// Quais sites podem chamar esta API. No .env dá pra configurar
// CLIENT_URL=https://vayra-front.vercel.app,http://localhost:5173 (separado por vírgula).
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((url) => url.trim())
  : ["http://localhost:5173", "http://localhost:5174"];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json()); // transforma o corpo JSON das requisições em req.body

// Rota simples pra testar se o servidor está de pé
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "API do Vayra rodando" });
});

app.use("/places", placeRoutes);
app.use("/schedules", scheduleRoutes);

// Rota não encontrada
app.use((req, res) => {
  res.status(404).json({ message: "Rota não encontrada" });
});

// Tratador de erros: qualquer erro jogado nas rotas cai aqui.
// (O Express sabe que é tratador de erro porque tem 4 parâmetros.)
app.use((error, req, res, next) => {
  // Erro de validação do mongoose (campo obrigatório faltando, texto grande demais...)
  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(" "), errors: messages });
  }
  // JSON mal formado no corpo da requisição
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ message: "JSON inválido" });
  }

  console.error(error);
  res.status(500).json({ message: "Erro interno no servidor" });
});

// Só começa a aceitar requisições DEPOIS de conectar no banco
await connectDB();
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
