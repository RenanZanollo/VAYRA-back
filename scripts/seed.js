// Preenche o banco com os lugares e o roteiro iniciais.
// Uso: npm run seed
//
// Seguro: se o banco JÁ tiver lugares ou itens, não faz nada (não apaga nem duplica).
import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../db.js";
import Place from "../models/Place.js";
import Schedule from "../models/Schedule.js";
import { places } from "../data/places.js";
import { schedules } from "../data/schedules.js";

await connectDB();

const [placeCount, scheduleCount] = await Promise.all([
  Place.countDocuments(),
  Schedule.countDocuments(),
]);

if (placeCount > 0 || scheduleCount > 0) {
  console.log(
    `O banco já tem dados (${placeCount} lugares, ${scheduleCount} itens). Nada foi alterado.`,
  );
  await mongoose.disconnect();
  process.exit(0);
}

// 1) Cria os lugares. O "_id" dos arquivos ("p1", "p2"...) não serve pro Mongo,
//    então tiramos ele e deixamos o Mongo gerar um ObjectId de verdade.
const createdPlaces = await Place.insertMany(
  places.map(({ _id, ...place }) => place),
);

// 2) Monta um "dicionário" de id antigo -> id novo: { p1: "6650a...", p2: "6650b..." }
//    insertMany devolve na mesma ordem em que recebeu, por isso o index bate.
const idMap = Object.fromEntries(
  places.map((place, index) => [place._id, createdPlaces[index]._id]),
);

// 3) Cria os itens do roteiro, trocando o place antigo pelo id novo
const createdSchedules = await Schedule.insertMany(
  schedules.map(({ _id, place, ...schedule }) => ({
    ...schedule,
    place: place ? idMap[place] : null,
  })),
);

console.log(
  `Pronto! ${createdPlaces.length} lugares e ${createdSchedules.length} itens criados.`,
);
await mongoose.disconnect();
