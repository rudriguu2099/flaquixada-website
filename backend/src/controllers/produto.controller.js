import { z } from "zod";
import { ProdutoValidationSchema } from "../models/produto.model.js";
import { ProdutoService } from "../services/produto.service.js";

export class ProdutoController {
  static async criarProduto(req, res) {
    try {
      const dadosValidados = ProdutoValidationSchema.parse(req.body);
      const produto = await ProdutoService.criarProduto(dadosValidados);

      return res.status(201).json({ success: true, data: produto });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ success: false, detalhes: error.flatten().fieldErrors });
      }

      return res.status(500).json({ success: false, error: error.message });
    }
  }

  static async listarTodos(req, res) {
    try {
      const { busca, ordenar } = req.query;

      const produtos = await ProdutoService.listarTodos({
        busca,
        ordenar,
      });

      return res
        .status(200)
        .json({ success: true, results: produtos.length, data: produtos });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  static async editarProduto(req, res) {
    try {
      const { id } = req.params;

      const dadosValidados = ProdutoValidationSchema.partial().parse(req.body);

      const produtoAtualizado = await ProdutoService.editarProduto(
        id,
        dadosValidados,
      );

      return res.status(200).json({ success: true, data: produtoAtualizado });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ success: false, detalhes: error.flatten().fieldErrors });
      }

      return res.status(404).json({ success: false, error: error.message });
    }
  }

  static async deletarProduto(req, res) {
    try {
      const { id } = req.params;

      await ProdutoService.deletarProduto(id);

      return res
        .status(200)
        .json({ success: true, message: "Produto deletado com sucesso." });
    } catch (error) {
      return res.status(404).json({ success: false, error: error.message });
    }
  }
}
