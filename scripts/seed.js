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

const createdPlaces = await Place.insertMany(
  places.map(({ _id, ...place }) => place),
);

const idMap = Object.fromEntries(
  places.map((place, index) => [place._id, createdPlaces[index]._id]),
);

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
