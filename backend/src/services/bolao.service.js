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

    return {
      mandante: this.gerarCartela(escalacao.mandante.titulares),
      visitante: this.gerarCartela(escalacao.visitante.titulares),
    };
  }
}
