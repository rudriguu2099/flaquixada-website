import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { conectarBanco } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import bolaoRoutes from "./routes/bolao.routes.js";
import cardapioRoutes from "./routes/cardapio.routes.js";
import fixturesRoutes from "./routes/fixtures.routes.js";
import noticiaRoutes from "./routes/noticia.routes.js";
import produtoRoutes from "./routes/produto.routes.js";
import usuarioRoutes from "./routes/usuario.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/fixtures", fixturesRoutes);
app.use("/api/cardapios", cardapioRoutes);
app.use("/api/noticias", noticiaRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/produtos", produtoRoutes);
app.use("/api/bolao", bolaoRoutes);

async function iniciarServidor() {
  await conectarBanco();

  app.listen(PORT, () => {
    console.log(`🔥 Servidor rodando em http://localhost:${PORT}`);
  });
}

iniciarServidor();
