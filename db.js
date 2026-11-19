import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado ao mongo");
  } catch (error) {
    console.error("Erro ao conectar no mongo:", error.message);
    process.exit(1);
  }
};
