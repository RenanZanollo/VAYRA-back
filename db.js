import mongoose from "mongoose";

// Virou uma função: quem chama decide QUANDO conectar
// (o servidor no index.js e o script de seed usam a mesma função).
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado ao mongo");
  } catch (error) {
    console.error("Erro ao conectar no mongo:", error.message);
    process.exit(1);
  }
};
