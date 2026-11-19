import mongoose from "mongoose";

const { Schema } = mongoose;

const PhotoSchema = new Schema(
  {
    url: { type: String, required: [true, "A url da foto é obrigatória"], trim: true },
    caption: { type: String, trim: true, default: "" },
  },
  { _id: false },
);

const PlaceSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "O nome do lugar é obrigatório"],
      trim: true,
      unique: true,
    },
    lat: {
      type: Number,
      required: [true, "A latitude é obrigatória"],
      min: [-90, "Latitude inválida"],
      max: [90, "Latitude inválida"],
    },
    lng: {
      type: Number,
      required: [true, "A longitude é obrigatória"],
      min: [-180, "Longitude inválida"],
      max: [180, "Longitude inválida"],
    },
    photos: {
      type: [PhotoSchema],
      default: [],
    },
  },
  { timestamps: true },
);

const Place = mongoose.model("Place", PlaceSchema);

export default Place;
