import { db } from "../config/db.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

export class UsuarioService {
  static async criar(usuarioData, usuarioLogado) {
    if (usuarioLogado.role !== "super-admin") {
      throw new Error("Apenas super-admin pode criar novos usuários");
    }

    const emailJaExiste = await db
      .collection("users")
      .findOne({ email: usuarioData.email });

    if (emailJaExiste) {
      throw new Error("Este e-mail já está cadastrado");
    }

    const senhaHash = await bcrypt.hash(usuarioData.password, 10);

    const novoUsuario = {
      email: usuarioData.email,
      nome: usuarioData.nome,
      password: senhaHash,
      role: usuarioData.role || "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const resultado = await db.collection("users").insertOne(novoUsuario);
    const { password, ...usuarioSemSenha } = novoUsuario;
    return { _id: resultado.insertedId, ...usuarioSemSenha };
  }

  static async listar() {
    const usuarios = await db
      .collection("users")
      .find({})
      .project({ password: 0 })
      .sort({ createdAt: -1 })
      .toArray();

    return usuarios;
  }

  static async buscarPorId(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error("ID inválido");
    }

    return await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } });
  }

  static async atualizar(id, dadosAtualizacao, usuarioLogado) {
    if (!ObjectId.isValid(id)) {
      throw new Error("ID inválido");
    }

    if (usuarioLogado.role !== "super-admin" && usuarioLogado.id !== id) {
      throw new Error("Você só pode atualizar seus próprios dados");
    }

    if (dadosAtualizacao.role && usuarioLogado.role !== "super-admin") {
      throw new Error("Apenas super-admin pode alterar roles");
    }

    if (dadosAtualizacao.email) {
      const emailJaExiste = await db
        .collection("users")
        .findOne({ email: dadosAtualizacao.email, _id: { $ne: new ObjectId(id) } });

      if (emailJaExiste) {
        throw new Error("Este e-mail já está cadastrado");
      }
    }

    if (dadosAtualizacao.password) {
      dadosAtualizacao.password = await bcrypt.hash(dadosAtualizacao.password, 10);
    }

    dadosAtualizacao.updatedAt = new Date();

    const resultado = await db
      .collection("users")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: dadosAtualizacao },
        {
          returnDocument: "after",
          includeResultMetadata: false,
          projection: { password: 0 },
        }
      );

    if (!resultado) {
      throw new Error("Usuário não encontrado");
    }

    return resultado;
  }

  static async deletar(id, usuarioLogado) {
    if (usuarioLogado.role !== "super-admin") {
      throw new Error("Apenas super-admin pode deletar usuários");
    }

    if (!ObjectId.isValid(id)) {
      throw new Error("ID inválido");
    }

    if (usuarioLogado.id === id) {
      throw new Error("Você não pode deletar sua própria conta");
    }

    const resultado = await db
      .collection("users")
      .deleteOne({ _id: new ObjectId(id) });

    if (resultado.deletedCount === 0) {
      throw new Error("Usuário não encontrado");
    }

    return { mensagem: "Usuário deletado com sucesso" };
  }
}
