import { z } from "zod";
import { NoticiaValidationSchema } from "../models/noticia.model.js";
import { NoticiaService } from "../services/noticia.service.js";

export class NoticiaController {
  static async criar(req, res) {
    try {
      const dadosValidados = NoticiaValidationSchema.parse(req.body);
      const resultado = await NoticiaService.criar(dadosValidados);

      return res.status(201).json({
        success: true,
        message: "Notícia criada com sucesso!",
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

      if (categoria) {
        filtros.categoria = categoria;
      }

      const noticias = await NoticiaService.listar(filtros);

      return res.status(200).json({
        success: true,
        data: noticias,
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
      const noticia = await NoticiaService.buscarPorId(id);

      if (!noticia) {
        return res.status(404).json({
          success: false,
          error: "Notícia não encontrada",
        });
      }

      return res.status(200).json({
        success: true,
        data: noticia,
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
      const dadosValidados = NoticiaValidationSchema.partial().parse(req.body);

      const resultado = await NoticiaService.atualizar(id, dadosValidados);

      return res.status(200).json({
        success: true,
        message: "Notícia atualizada com sucesso!",
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

      if (error.message === "Notícia não encontrada") {
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
      const resultado = await NoticiaService.deletar(id);

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

      if (error.message === "Notícia não encontrada") {
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
