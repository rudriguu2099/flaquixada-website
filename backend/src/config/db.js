import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { createCardapioIndexes } from "./indexes/cardapios.js";
import { createNoticiaIndexes } from "./indexes/noticias.js";
import { createProdutoIndexes } from "./indexes/produto.js";
import { createUserIndexes } from "./indexes/users.js";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);
let db;

export async function conectarBanco() {
  try {
    await client.connect();
    db = client.db();

    await createUserIndexes(db);
    await createCardapioIndexes(db);
    await createNoticiaIndexes(db);
    await createProdutoIndexes(db);

    console.log("🌱 MongoDB Conectado Nativamente com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar ao banco de dados:", error);
    process.exit(1);
  }
}

export { db };
