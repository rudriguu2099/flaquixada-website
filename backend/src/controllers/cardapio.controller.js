import { z } from "zod";
import { CardapioValidationSchema } from "../models/cardapio.model.js";
import { CardapioService } from "../services/cardapio.service.js";

export class CardapioController {
  static async criar(req, res) {
    try {
      const dadosValidados = CardapioValidationSchema.parse(req.body);
      const resultado = await CardapioService.criar(dadosValidados);

      return res.status(201).json({
        success: true,
        message: "Cardápio criado com sucesso!",
        data: resultado,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: "Dados de entrada inválidos",
          detalhes: error.flatten().fieldErrors,
        });
      }

      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async listar(req, res) {
    try {
      const { categoria } = req.query;
      const filtros = {};

      if (categoria && ["bebidas", "petiscos", "pratos"].includes(categoria)) {
        filtros.categoria = categoria;
      }


      const cardapios = await CardapioService.listar(filtros);

      return res.status(200).json({
        success: true,
        data: cardapios,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const cardapio = await CardapioService.buscarPorId(id);

      if (!cardapio) {
        return res.status(404).json({
          success: false,
          error: "Cardápio não encontrado",
        });
      }

      return res.status(200).json({
        success: true,
        data: cardapio,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const dadosValidados = CardapioValidationSchema.partial().parse(req.body);

      const resultado = await CardapioService.atualizar(id, dadosValidados);

      return res.status(200).json({
        success: true,
        message: "Cardápio atualizado com sucesso!",
        data: resultado,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: "Dados de entrada inválidos",
          detalhes: error.flatten().fieldErrors,
        });
      }

      if (error.message === "ID inválido") {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      if (error.message === "Cardápio não encontrado") {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async deletar(req, res) {
    try {
      const { id } = req.params;
      const resultado = await CardapioService.deletar(id);

      return res.status(200).json({
        success: true,
        message: resultado.mensagem,
      });
    } catch (error) {
      if (error.message === "ID inválido") {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      if (error.message === "Cardápio não encontrado") {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}
