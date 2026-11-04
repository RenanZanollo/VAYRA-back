import express from "express";
import "dotenv/config"

const app = express
const port = process.env.PORT

app.use(cors({ origin: "http://localhost:5173" }))
app.use(express.json());