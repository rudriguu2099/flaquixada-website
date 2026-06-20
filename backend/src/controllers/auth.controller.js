import { z } from "zod";
import {
  LoginValidationSchema,
  RegistroValidationSchema,
} from "../models/user.model.js";
import { AuthService } from "../services/auth.service.js";

export class AuthController {
  static async login(req, res) {
    try {
      const dadosValidados = LoginValidationSchema.parse(req.body);

      const resultado = await AuthService.login(
        dadosValidados.email,
        dadosValidados.password,
      );

      return res.status(200).json({
        success: true,
        message: "Login efetuado com sucesso!",
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

      return res.status(401).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async registrar(req, res) {
    try {
      const dadosValidados = RegistroValidationSchema.parse(req.body);

      const novoAdmin = await AuthService.registrar(
        dadosValidados.email,
        dadosValidados.password,
        dadosValidados.role,
      );

      return res.status(201).json({
        success: true,
        message: "Novo administrador criado com sucesso!",
        data: novoAdmin,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: "Dados de registro inválidos",
          detalhes: error.flatten().fieldErrors,
        });
      }

      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
}
