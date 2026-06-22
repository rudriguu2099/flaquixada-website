import { BolaoService } from "../services/bolao.service.js";
import { ApostaBolaoValidationSchema, ConfigBolaoValidationSchema, StatusBolaoValidationSchema, JogadoresBolaoValidationSchema } from "../models/bolao.model.js";
import { z } from "zod";

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


  static async apostarSlot(req, res) {
    try {
      const dadosValidados = ApostaBolaoValidationSchema.parse(req.body);
      await BolaoService.realizarApostaConsulado(dadosValidados);

      return res.status(201).json({ success: true, message: "Aposta gravada no slot com sucesso!" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, detalhes: error.flatten().fieldErrors });
      }
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  static async consultarPainel(req, res) {
    try {
      const { idJogo } = req.params;
      const painel = await BolaoService.obterEstadoDoBolao(idJogo); 
      return res.status(200).json({ success: true, data: painel });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  static async deletarAposta(req, res) {
    try {
      const { idJogo, numeroSlot } = req.params;
      await BolaoService.removerAposta(idJogo, numeroSlot);
      return res.status(200).json({ success: true, message: "Slot liberado com sucesso!" });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  static async alterarSlot(req, res) {
    try {
      const { idJogo } = req.params;
      const { numeroSlotAtual, novoNumeroSlot } = req.body;

      if (!numeroSlotAtual || !novoNumeroSlot) {
        return res.status(400).json({ success: false, error: "Campos numeroSlotAtual e novoNumeroSlot são obrigatórios." });
      }

      await BolaoService.atualizarSlotAposta(idJogo, numeroSlotAtual, novoNumeroSlot);
      return res.status(200).json({ success: true, message: "Slot altered com sucesso!" });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  static async alterarNomeParticipante(req, res) {
    try {
      const { idJogo, numeroSlot } = req.params;
      const { nome } = req.body;

      if (!nome) {
        return res.status(400).json({ success: false, error: "O campo nome é obrigatório." });
      }

      await BolaoService.atualizarNomeAposta(idJogo, numeroSlot, nome);
      return res.status(200).json({ success: true, message: "Nome do participante alterado com sucesso!" });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  static async limparJogo(req, res) {
    try {
      const { idJogo } = req.params;
      await BolaoService.resetarDadosDoJogo(idJogo);
      return res.status(200).json({ success: true, message: "Dados do jogo apagados para economia de espaço!" });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
  static async alternarPagamento(req, res) {
    try {
      const { idJogo, numeroSlot } = req.params;
      const resultado = await BolaoService.alternarPagamento(idJogo, numeroSlot);
      return res.status(200).json({ success: true, message: "Status de pagamento alterado com sucesso!", data: resultado });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  static async obterConfiguracao(req, res) {
    try {
      const config = await BolaoService.obterConfiguracaoGlobais();
      return res.status(200).json({ success: true, data: config });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  static async salvarConfiguracao(req, res) {
    try {
      const dadosValidados = ConfigBolaoValidationSchema.parse(req.body);
      const config = await BolaoService.salvarConfiguracaoGlobais(dadosValidados.idJogoAtivo);
      return res.status(200).json({ success: true, message: "Configuração global salva com sucesso!", data: config });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, detalhes: error.flatten().fieldErrors });
      }
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  static async alterarStatus(req, res) {
    try {
      const { idJogo } = req.params;
      const dadosValidados = StatusBolaoValidationSchema.parse(req.body);
      const resultado = await BolaoService.salvarStatusManual(idJogo, dadosValidados.status);
      return res.status(200).json({ success: true, message: "Status alterado com sucesso!", data: resultado });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, detalhes: error.flatten().fieldErrors });
      }
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  static async salvarJogadores(req, res) {
    try {
      const { idJogo } = req.params;
      const dadosValidados = JogadoresBolaoValidationSchema.parse(req.body);
      const resultado = await BolaoService.salvarJogadoresManuais(idJogo, dadosValidados.jogadores);
      return res.status(200).json({ success: true, message: "Jogadores salvos com sucesso!", data: resultado });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, detalhes: error.flatten().fieldErrors });
      }
      return res.status(400).json({ success: false, error: error.message });
    }
  }
}
