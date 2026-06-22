import { db } from "../config/db.js"
import { FixturesService } from "./fixtures.service.js";

export class BolaoService {
  static embaralharArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  static gerarCartela(titulares) {
    let jogadoresDeLinha = titulares.filter((j) => j.posicao !== "Goleiro");

    if (jogadoresDeLinha.length < 10) {
      const goleiro = titulares.find((j) => j.posicao === "Goleiro");
      if (goleiro) jogadoresDeLinha.push(goleiro);
    }

    jogadoresDeLinha = jogadoresDeLinha.slice(0, 10);

    const jogadoresSorteados = this.embaralharArray(jogadoresDeLinha);

    return jogadoresSorteados.map((jogador, index) => ({
      numeroSorteado: index + 1,
      id: jogador.id,
      nome: jogador.nome,
      posicao: jogador.posicao,
      foto: jogador.foto,
    }));
  }

  static async sortearBolaoDoJogo(idJogo) {
    const escalacao = await FixturesService.obterEscalacao(idJogo);

    if (!escalacao) {
      throw new Error(
        "Não foi possível buscar a escalação para sortear o bolão.",
      );
    }

    const resultadoSorteio = {
      mandante: this.gerarCartela(escalacao.mandante.titulares),
      visitante: this.gerarCartela(escalacao.visitante.titulares),
    };

    await db.collection("sorteios_bolao").updateOne(
      { idJogo: String(idJogo) },
      { 
        $set: {
          idJogo: String(idJogo),
          data: resultadoSorteio,
          sorteadoEm: new Date()
        } 
      },
      { upsert: true }
    );

    return resultadoSorteio;
  }

  static async realizarApostaConsulado(dadosAposta) {
    const idJogoStr = String(dadosAposta.idJogo);
    const numeroSlotNum = Number(dadosAposta.numeroSlot);

    const slotOcupado = await db.collection("apostas_bolao").findOne({
      idJogo: idJogoStr,
      numeroSlot: numeroSlotNum
    });

    if (slotOcupado) {
      throw new Error(`Este número de slot já foi preenchido por outro membro (${slotOcupado.participanteNome || 'Membro'}).`);
    }

    const novaAposta = {
      idJogo: idJogoStr,
      numeroSlot: numeroSlotNum,
      participanteNome: dadosAposta.participanteNome,
      createdAt: new Date()
    };

    await db.collection("apostas_bolao").insertOne(novaAposta);
    return { success: true };
  }

  static async obterEstadoDoBolao(idJogo) {
    const apostas = await db.collection("apostas_bolao").find({ idJogo: String(idJogo) }).toArray();
    const sorteioExistente = await db.collection("sorteios_bolao").findOne({ idJogo: String(idJogo) });
    const jaSorteado = !!sorteioExistente;

    const slots = Array.from({ length: 10 }, (_, i) => {
      const numeroSlot = i + 1;
      const apostaDoSlot = apostas.find(a => a.numeroSlot === numeroSlot);
      let jogadorSorteado = "Aguardando Escalação/Sorteio";

      if (jaSorteado) {
        const timeDoBolao = sorteioExistente.data?.visitante || sorteioExistente.visitante;
        if (timeDoBolao) {
          const jogador = timeDoBolao.find(j => j.numeroSorteado === numeroSlot);
          jogadorSorteado = jogador ? `${jogador.nome} (${jogador.posicao})` : "Não mapeado";
        }
      }

      return {
        id: numeroSlot,
        numeroSlot,
        participante: apostaDoSlot ? apostaDoSlot.participanteNome : "",
        jogadorSorteado
      };
    });

    return { idJogo: String(idJogo), jaSorteado, slots };
  }

  static async removerAposta(idJogo, numeroSlot) {
    const resultado = await db.collection("apostas_bolao").deleteOne({
      idJogo: String(idJogo),
      numeroSlot: Number(numeroSlot)
    });
    
    if (resultado.deletedCount === 0) {
      throw new Error("Nenhuma aposta encontrada para este slot neste jogo.");
    }
    return true;
  }

  static async atualizarSlotAposta(idJogo, numeroSlotAtual, novoNumeroSlot) {
    const idJogoStr = String(idJogo);
    const nSlotAtual = Number(numeroSlotAtual);
    const nNovoSlot = Number(novoNumeroSlot);

    if (nSlotAtual === nNovoSlot) {
      throw new Error("O novo slot informado é idêntico ao slot atual.");
    }

    const slotOcupado = await db.collection("apostas_bolao").findOne({
      idJogo: idJogoStr,
      numeroSlot: nNovoSlot
    });

    if (slotOcupado) {
      throw new Error(`O Slot ${nNovoSlot} já está preenchido por outro participante.`);
    }

    const resultado = await db.collection("apostas_bolao").updateOne(
      { idJogo: idJogoStr, numeroSlot: nSlotAtual },
      { $set: { numeroSlot: nNovoSlot } }
    );

    if (resultado.matchedCount === 0) {
      throw new Error("Aposta original não encontrada para modificação.");
    }
    return true;
  }

  static async resetarDadosDoJogo(idJogo) {
    await db.collection("apostas_bolao").deleteMany({ idJogo: String(idJogo) });
    await db.collection("sorteios_bolao").deleteOne({ idJogo: String(idJogo) });
    return true;
  }
}