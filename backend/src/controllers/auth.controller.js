import { z } from "zod";
import { LoginValidationSchema } from "../models/user.model.js";
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
}
