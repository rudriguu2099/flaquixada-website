import { ObjectId } from "mongodb";
import { db } from "../config/db.js";
import { Produto } from "../models/produto.model.js";

export class ProdutoService {
  static async criarProduto(produtoData) {
    const novoProduto = new Produto({
      nome: produtoData.nome,
      preco: produtoData.preco,
      descricao: produtoData.descricao,
      foto: produtoData.fotoBase64,
    });

    const produtoCriado = await db
      .collection("produtos")
      .insertOne(novoProduto.toDocument());

    return { id: produtoCriado.insertedId, ...novoProduto };
  }

  static async listarTodos(filtros = {}) {
    const query = {};
    const ordenacao = {};

    if (filtros.busca) {
      query.$text = { $search: filtros.busca };
    }

    if (filtros.ordenar === "preco_asc") {
      ordenacao.preco = 1; // mais barato ao mais caro
    } else if (filtros.ordenar === "preco_desc") {
      ordenacao.preco = -1; // mais caro ao mais barato
    } else if (filtros.busca) {
      ordenacao.score = { $meta: "textScore" };
    } else {
      ordenacao.createdAt = -1; // padrão: mais recentes primeiro
    }

    const modoBusca = filtros.busca ? { score: { $meta: "textScore" } } : {};

    return await db
      .collection("produtos")
      .find(query, { projection: modoBusca })
      .sort(ordenacao)
      .toArray();
  }

  static async buscarPorId(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error("ID inválido");
    }

    return await db.collection("produtos").findOne({ _id: new ObjectId(id) });
  }

  static async editarProduto(id, dadosAtualizados) {
    if (!ObjectId.isValid(id)) {
      throw new Error("ID inválido");
    }

    // ? atualiza foto corretamente
    if (dadosAtualizados.fotoBase64) {
      dadosAtualizados.foto = dadosAtualizados.fotoBase64;
      delete dadosAtualizados.fotoBase64; // Remove a chave antiga para não poluir o banco
    }

    const resultado = await db
      .collection("produtos")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { ...dadosAtualizados, updatedAt: new Date() } },
        { returnDocument: "after" },
      );

    if (!resultado) {
      throw new Error("Produto não encontrado");
    }

    return resultado;
  }

  static async deletarProduto(id) {
    const exclusao = await db
      .collection("produtos")
      .deleteOne({ _id: new ObjectId(id) });

    if (exclusao.deletedCount === 0) {
      throw new Error("Produto não encontrado");
    }

    return exclusao.acknowledged;
  }
}
