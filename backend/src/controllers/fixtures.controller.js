import { FixturesService } from "../services/fixtures.service.js";

export class FixturesController {
  static async listarCalendario(req, res) {
    try {
      const calendario = await FixturesService.obterCalendario();

      return res.status(200).json({
        success: true,
        results: calendario.length,
        data: calendario,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Não foi possível carregar o calendário de jogos.",
        detalhes: error.message,
      });
    }
  }

  static async obterEscalacao(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: "O ID do jogo é obrigatório nos parâmetros da rota.",
        });
      }

      const escalacao = await FixturesService.obterEscalacao(id);

      if (!escalacao) {
        return res.status(404).json({
          success: false,
          error:
            "Escalação oficial não disponível ou jogo não encontrado para este ID.",
        });
      }

      return res.status(200).json({
        success: true,
        data: escalacao,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Não foi possível carregar a escalação do jogo.",
        detalhes: error.message,
      });
    }
  }
}
