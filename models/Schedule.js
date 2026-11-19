import mongoose from "mongoose";

const { Schema } = mongoose;

const ScheduleSchema = new Schema(
  {
    date: {
      type: String,
      required: [true, "A data é obrigatória"],
      match: [/^\d{4}-\d{2}-\d{2}$/, "A data deve estar no formato AAAA-MM-DD"],
    },

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

    placeName: {
      type: String,
      trim: true,
      default: "",
    },

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
