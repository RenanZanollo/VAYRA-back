import mongoose from "mongoose";

const {Schema} = mongoose;

const PlaceSchema = new Schema({
    name: {
        tipo: String;
        required: [true, "Nome do lugar deve ser obrigatório"]
        
    }
})