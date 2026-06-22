import { db } from "../config/db.js";
import { ObjectId } from "mongodb";

export class NoticiaService {
  static async criar(noticiaData) {
    const novaNoticia = {
      ...noticiaData,
      data: noticiaData.data || new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const resultado = await db.collection("noticias").insertOne(novaNoticia);
    return { _id: resultado.insertedId, ...novaNoticia };
  }

  static async listar(filtros = {}) {
    const query = {};

    if (filtros.categoria) {
      query.categoria = filtros.categoria;
    }

    return await db
      .collection("noticias")
      .find(query)
      .sort({ data: -1 })
      .toArray();
  }

  static async buscarPorId(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error("ID inválido");
    }

    return await db.collection("noticias").findOne({ _id: new ObjectId(id) });
  }

  static async atualizar(id, dadosAtualizacao) {
    if (!ObjectId.isValid(id)) {
      throw new Error("ID inválido");
    }

    dadosAtualizacao.updatedAt = new Date();

    const resultado = await db
      .collection("noticias")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: dadosAtualizacao },
        { returnDocument: "after", includeResultMetadata: false }
      );

    if (!resultado) {
      throw new Error("Notícia não encontrada");
    }

    return resultado;
  }

  static async deletar(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error("ID inválido");
    }

    const resultado = await db
      .collection("noticias")
      .deleteOne({ _id: new ObjectId(id) });

    if (resultado.deletedCount === 0) {
      throw new Error("Notícia não encontrada");
    }

    return { mensagem: "Notícia deletada com sucesso" };
  }
}
