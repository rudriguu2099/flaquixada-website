import dotenv from "dotenv";
import {
  buscarJogosDoDia,
  buscarEscalacao,
} from "./scraping/games-resolver.scraping.js";

dotenv.config();

let cacheCalendario = null;
let ultimaAtualizacao = null;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hora

export class FixturesService {
  static async obterCalendario() {
    const agora = Date.now();

    // Como não há mais filtros dinâmicos por parâmetro, o cache funciona sempre que estiver no prazo
    if (
      cacheCalendario &&
      ultimaAtualizacao &&
      agora - ultimaAtualizacao < CACHE_DURATION
    ) {
      return cacheCalendario;
    }

    const todosOsJogos = await buscarJogosDoDia();

    if (!todosOsJogos || todosOsJogos.length === 0) {
      return [];
    }

    // Se quiser manter o filtro do Flamengo ativo, descomente o bloco abaixo:
    /*
    const jogosFiltrados = todosOsJogos.filter((partida) => {
      const nomeCasa = partida.homeTeam?.name?.toLowerCase() || "";
      const nomeFora = partida.awayTeam?.name?.toLowerCase() || "";
      return nomeCasa.includes("flamengo") || nomeFora.includes("flamengo");
    });
    */

    // Se descomentar o filtro do Flamengo acima, mude "todosOsJogos.map" para "jogosFiltrados.map" abaixo:
    const calendarioFormatado = todosOsJogos.map((partida) => ({
      id: partida.id,
      dataIso: new Date(partida.startTimestamp * 1000).toISOString(),
      campeonato: partida.tournament?.name || "Campeonato",
      rodada: partida.roundInfo?.round || "Rodada",
      estadio: "A definir",
      placar:
        partida.status?.type !== "notstarted"
          ? {
              casa: partida.homeScore?.current ?? 0,
              visitante: partida.awayScore?.current ?? 0,
              status: partida.status?.description || "Encerrado",
            }
          : null,
      mandante: {
        nome: partida.homeTeam.name,
        logo: partida.homeTeam.logoUrl || "",
      },
      visitante: {
        nome: partida.awayTeam.name,
        logo: partida.awayTeam.logoUrl || "",
      },
    }));

    cacheCalendario = calendarioFormatado;
    ultimaAtualizacao = agora;

    return calendarioFormatado;
  }

  static async obterEscalacao(idJogo) {
    return await buscarEscalacao(idJogo);
  }
}
