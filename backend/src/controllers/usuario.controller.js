import { z } from "zod";
import { UsuarioValidationSchema } from "../models/usuario.model.js";
import { UsuarioService } from "../services/usuario.service.js";

export class UsuarioController {
  static async criar(req, res) {
    try {
      const dadosValidados = UsuarioValidationSchema.parse(req.body);
      const resultado = await UsuarioService.criar(
        dadosValidados,
        req.usuarioLogado,
      );

      return res.status(201).json({
        success: true,
        message: "Usuário criado com sucesso!",
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

      if (error.message.includes("super-admin")) {
        return res.status(403).json({
          success: false,
          error: error.message,
        });
      }

      if (error.message === "Este e-mail já está cadastrado") {
        return res.status(409).json({
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

  static async listar(req, res) {
    try {
      const usuarios = await UsuarioService.listar();

      return res.status(200).json({
        success: true,
        data: usuarios,
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
      const usuario = await UsuarioService.buscarPorId(id);

      if (!usuario) {
        return res.status(404).json({
          success: false,
          error: "Usuário não encontrado",
        });
      }

      return res.status(200).json({
        success: true,
        data: usuario,
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
      const bodyOriginal = req.body ?? {};
      const dadosValidados = UsuarioValidationSchema.partial().parse(req.body);

      if (!Object.hasOwn(bodyOriginal, "role")) {
        delete dadosValidados.role;
      }

      const resultado = await UsuarioService.atualizar(
        id,
        dadosValidados,
        req.usuarioLogado,
      );

      return res.status(200).json({
        success: true,
        message: "Usuário atualizado com sucesso!",
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

      if (error.message.includes("super-admin") || error.message.includes("seus próprios dados")) {
        return res.status(403).json({
          success: false,
          error: error.message,
        });
      }

      if (error.message === "Usuário não encontrado") {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }

      if (error.message === "Este e-mail já está cadastrado") {
        return res.status(409).json({
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
      const resultado = await UsuarioService.deletar(id, req.usuarioLogado);

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

      if (error.message.includes("super-admin") || error.message.includes("própria conta")) {
        return res.status(403).json({
          success: false,
          error: error.message,
        });
      }

      if (error.message === "Usuário não encontrado") {
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
