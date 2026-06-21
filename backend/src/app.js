import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { conectarBanco } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import fixturesRoutes from "./routes/fixtures.routes.js";
import cardapioRoutes from "./routes/cardapio.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/fixtures", fixturesRoutes);
app.use("/api/cardapios", cardapioRoutes);

async function iniciarServidor() {
  await conectarBanco();

  app.listen(PORT, () => {
    console.log(`🔥 Servidor rodando em http://localhost:${PORT}`);
  });
}

iniciarServidor();
