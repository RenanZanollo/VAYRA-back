import { Router } from "express";
import mongoose from "mongoose";
import Place from "../models/Place.js";
import Schedule from "../models/Schedule.js";

const router = Router();

// Pega só os campos que a gente aceita do corpo da requisição
// (nada de o cliente mandar _id, createdAt etc.)
const pickScheduleFields = ({ date, time, title, description, placeName, place }) => ({
  date,
  time,
  title,
  description,
  placeName,
  place: place || null,
});

// Se veio um lugar do catálogo, confere se ele existe de verdade.
// Devolve true/false, e quem chama decide responder 400.
const placeExists = async (place) => {
  if (!place) return true; // sem lugar (texto livre) é válido
  return mongoose.isValidObjectId(place) && Boolean(await Place.exists({ _id: place }));
};

// GET /schedules          -> todos os itens do roteiro
// GET /schedules?date=... -> só os itens daquele dia
router.get("/", async (req, res) => {
  const filter = req.query.date ? { date: req.query.date } : {};
  const schedules = await Schedule.find(filter).sort({ date: 1, time: 1 });
  res.json(schedules);
});

// POST /schedules -> cria um item novo
router.post("/", async (req, res) => {
  const fields = pickScheduleFields(req.body);

  if (!(await placeExists(fields.place))) {
    return res.status(400).json({ message: "Lugar não encontrado no catálogo" });
  }

  // create() roda as validações do schema (required, maxlength, match...)
  // Se algo falhar, o erro vai pro tratador lá no index.js e vira um 400.
  const schedule = await Schedule.create(fields);

  // 201 = "Created": o padrão HTTP pra quando algo novo foi criado
  res.status(201).json(schedule);
});

// PUT /schedules/:id -> atualiza um item existente
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  // Id mal formado nem chega no banco: já sabemos que não existe
  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ message: "Item não encontrado" });
  }

  const fields = pickScheduleFields(req.body);

  if (!(await placeExists(fields.place))) {
    return res.status(400).json({ message: "Lugar não encontrado no catálogo" });
  }

  const schedule = await Schedule.findByIdAndUpdate(id, fields, {
    returnDocument: "after", // devolve o documento DEPOIS da atualização (o padrão é o de antes)
    runValidators: true, // no update o mongoose NÃO valida sozinho; isso liga as validações
  });

  if (!schedule) {
    return res.status(404).json({ message: "Item não encontrado" });
  }

  res.json(schedule);
});

// DELETE /schedules/:id -> apaga um item
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ message: "Item não encontrado" });
  }

  const schedule = await Schedule.findByIdAndDelete(id);

  if (!schedule) {
    return res.status(404).json({ message: "Item não encontrado" });
  }

  // 204 = "No Content": deu certo e não há nada pra devolver
  res.status(204).end();
});

export default router;
