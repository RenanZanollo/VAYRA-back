import { Router } from "express";
import mongoose from "mongoose";
import Place from "../models/Place.js";
import Schedule from "../models/Schedule.js";

const router = Router();

const pickScheduleFields = ({ date, time, title, description, placeName, place }) => ({
  date,
  time,
  title,
  description,
  placeName,
  place: place || null,
});

const placeExists = async (place) => {
  if (!place) return true;
  return mongoose.isValidObjectId(place) && Boolean(await Place.exists({ _id: place }));
};

router.get("/", async (req, res) => {
  const filter = req.query.date ? { date: req.query.date } : {};
  const schedules = await Schedule.find(filter).sort({ date: 1, time: 1 });
  res.json(schedules);
});

router.post("/", async (req, res) => {
  const fields = pickScheduleFields(req.body);

  if (!(await placeExists(fields.place))) {
    return res.status(400).json({ message: "Lugar não encontrado no catálogo" });
  }

  const schedule = await Schedule.create(fields);

  res.status(201).json(schedule);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ message: "Item não encontrado" });
  }

  const fields = pickScheduleFields(req.body);

  if (!(await placeExists(fields.place))) {
    return res.status(400).json({ message: "Lugar não encontrado no catálogo" });
  }

  const schedule = await Schedule.findByIdAndUpdate(id, fields, {
    returnDocument: "after",
    runValidators: true,
  });

  if (!schedule) {
    return res.status(404).json({ message: "Item não encontrado" });
  }

  res.json(schedule);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ message: "Item não encontrado" });
  }

  const schedule = await Schedule.findByIdAndDelete(id);

  if (!schedule) {
    return res.status(404).json({ message: "Item não encontrado" });
  }

  res.status(204).end();
});

export default router;
