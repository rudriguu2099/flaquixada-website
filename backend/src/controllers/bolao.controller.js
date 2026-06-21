import { BolaoService } from "../services/bolao.service.js";

export class BolaoController {
  static async realizarSorteio(req, res) {
    try {
      const { idJogo } = req.params;

      if (!idJogo) {
        return res.status(400).json({
          success: false,
          error: "O ID do jogo é obrigatório.",
        });
      }

      const cartelasSorteada = await BolaoService.sortearBolaoDoJogo(idJogo);

      return res.status(200).json({
        success: true,
        message: "Sorteio dos 10 números realizado com sucesso!",
        data: cartelasSorteada,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Erro ao gerar o sorteio do bolão.",
        detalhes: error.message,
      });
    }
  }
}
