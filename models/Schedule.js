import mongoose from "mongoose";

const { Schema } = mongoose;

const ScheduleSchema = new Schema(
  {
    // Data do dia no formato "2026-12-28". String de propósito: guardar como Date
    // traz fuso horário junto e o dia pode "pular" pro anterior no Brasil.
    date: {
      type: String,
      required: [true, "A data é obrigatória"],
      match: [/^\d{4}-\d{2}-\d{2}$/, "A data deve estar no formato AAAA-MM-DD"],
    },

    // Horário "08:30". String no formato HH:mm ordena certinho comparando texto.
    time: {
      type: String,
      required: [true, "O horário é obrigatório"],
      match: [/^([01]\d|2[0-3]):[0-5]\d$/, "O horário deve estar no formato HH:mm"],
    },

    title: {
      type: String,
      required: [true, "O título é obrigatório"],
      maxlength: [30, "O título deve ter no máximo 30 caracteres"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [120, "A descrição deve ter no máximo 120 caracteres"],
      default: "",
    },

    // Texto livre que aparece no card ("Sorocaba", "Praia do Góes"...)
    placeName: {
      type: String,
      trim: true,
      default: "",
    },

    // Link pro catálogo de lugares. null = lugar livre (não aparece no mapa).
    place: {
      type: Schema.Types.ObjectId,
      ref: "Place",
      default: null,
    },
  },
  { timestamps: true },
);

const Schedule = mongoose.model("Schedule", ScheduleSchema);

export default Schedule;
