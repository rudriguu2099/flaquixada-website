import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { createUserIndexes } from "./indexes/users.js";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);
let db;

export async function conectarBanco() {
  try {
    await client.connect();
    db = client.db();
    console.log("🌱 MongoDB Conectado Nativamente com sucesso!");

    await createUserIndexes(db);
    // await db.collection("users").insertOne({
    //   email: "randsonalves77@gmail.com",
    //   password: bcrypt.hashSync("12345678", 10),
    // });
  } catch (error) {
    console.error("❌ Erro ao conectar ao banco de dados:", error);
    process.exit(1);
  }
}

export { db };
