import mongoose from "mongoose";

const { Schema } = mongoose;

const ScheduleSchema = new Schema(
  {
    time: {
      type: Number,
      required: [true, "O horario é obrigatório"],
      min: [1, "Espécie inválida"],
    },

    optionalText: {
      type: String,
      default: [],
    },

    title: {
      type: String,
      required: [true, "O titulo é obrigatório"],
      maxlength: [30, "O apelido deve ter no máximo 20 caracteres"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [120, "O apelido deve ter no máximo 20 caracteres"],
      default: "",
    },

    place: {
      type: ObjectID,
      ref: "Place"
    },

    placeName:{
      type: String;
      
    }
  },

  {
    timestamps: true,
  },
);

const Schedule = mongoose.model("Schedule", ScheduleSchema);

export default Schedule;
