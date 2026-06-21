import { db } from "../config/db.js";
import { ObjectId } from "mongodb";

export class CardapioService {
  static async criar(cardapioData) {
    const novoCardapio = {
      ...cardapioData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const resultado = await db.collection("cardapios").insertOne(novoCardapio);
    return { _id: resultado.insertedId, ...novoCardapio };
  }

  static async listar(filtros = {}) {
    const query = {}

    if (filtros.categoria) {
      query.categoria = filtros.categoria;
    }

    return await db
      .collection("cardapios")
      .find(query)
      .sort({ categoria: 1, nome: 1 })
      .toArray();
  }

  static async buscarPorId(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error("ID inválido");
    }

    return await db
      .collection("cardapios")
      .findOne({ _id: new ObjectId(id) });
  }

static async atualizar(id, dadosAtualizacao) {
    if (!ObjectId.isValid(id)) {
      throw new Error("ID inválido");
    }

    dadosAtualizacao.updatedAt = new Date();

    const resultado = await db
      .collection("cardapios")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: dadosAtualizacao },
        { returnDocument: "after" }
      );

    if (!resultado) {
      throw new Error("Cardápio não encontrado");
    }

    return resultado;
  }

  static async deletar(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error("ID inválido");
    }

    const resultado = await db
      .collection("cardapios")
      .deleteOne({ _id: new ObjectId(id) });

    if (resultado.deletedCount === 0) {
      throw new Error("Cardápio não encontrado");
    }

    return { mensagem: "Cardápio deletado com sucesso" };
  }
}
