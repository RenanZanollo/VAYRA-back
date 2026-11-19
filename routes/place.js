import { Router } from "express";
import Place from "../models/Place.js";

const router = Router();

// GET /places -> lista todos os lugares do catálogo (pro mapa, galeria e autocomplete)
router.get("/", async (req, res) => {
  const places = await Place.find().sort({ name: 1 });
  res.json(places);
});

export default router;
