export async function buscarJogosDoDia() {
  const url = "https://api.cartola.globo.com/partidas";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erro API Globo: ${response.status}`);

    const dados = await response.json();
    const partidas = dados.partidas || [];
    const numeroRodada = dados.rodada || "A definir";

    const eventosFormatados = partidas.map((p) => {
      const clubeCasa = dados.clubes[p.clube_casa_id];
      const clubeFora = dados.clubes[p.clube_visitante_id];

      // Determina o status com base nas flags da Globo
      let tipoStatus = "notstarted";
      if (p.partida_encerrada) {
        tipoStatus = "finished";
      } else if (
        p.placar_oficial_mandante !== null ||
        p.placar_oficial_visitante !== null
      ) {
        tipoStatus = "inprogress";
      }

      return {
        id: p.partida_id,
        // Usando o campo timestamp original que veio no JSON da Globo
        startTimestamp: p.timestamp,
        tournament: { name: "Campeonato Brasileiro" },
        roundInfo: { round: `${numeroRodada}ª Rodada` },
        status: {
          type: tipoStatus,
          description: p.partida_encerrada ? "Encerrado" : "Ao vivo",
        },
        homeTeam: {
          id: p.clube_casa_id,
          // nome_fantasia garante "Flamengo", "Chapecoense", etc. por extenso
          name: clubeCasa?.nome_fantasia || clubeCasa?.nome || "Time Casa",
          // Mapeia a string exata do link do escudo
          logoUrl:
            clubeCasa?.escudos?.["60x60"] || clubeCasa?.escudos?.medias || "",
        },
        awayTeam: {
          id: p.clube_visitante_id,
          name: clubeFora?.nome_fantasia || clubeFora?.nome || "Time Visitante",
          logoUrl:
            clubeFora?.escudos?.["60x60"] || clubeFora?.escudos?.medias || "",
        },
        // O Cartola usa placar_oficial_mandante para os gols
        homeScore: { current: p.placar_oficial_mandante ?? 0 },
        awayScore: { current: p.placar_oficial_visitante ?? 0 },
      };
    });

    console.log(
      `[Globo API] Total de partidas processadas no campeonato: ${eventosFormatados.length}`,
    );
    return eventosFormatados;
  } catch (erro) {
    console.error("Erro ao buscar dados na API da Globo:", erro.message);
    return [];
  }
}

// Substitua ou adicione no seu arquivo games-resolver.scraping.js:

export async function buscarEscalacao(idJogo) {
  try {
    // 1. Buscamos as partidas para descobrir quem joga contra quem nesse idJogo
    const resPartidas = await fetch("https://api.cartola.globo.com/partidas");
    if (!resPartidas.ok) return null;
    const dadosPartidas = await resPartidas.json();

    const partida = dadosPartidas.partidas.find(
      (p) => p.partida_id === Number(idJogo),
    );
    if (!partida) {
      console.error(`Partida com ID ${idJogo} não encontrada no Cartola.`);
      return null;
    }

    const idMandante = partida.clube_casa_id;
    const idVisitante = partida.clube_visitante_id;

    // 2. Buscamos o mercado de atletas para pegar quem está escalado/provável
    const resAtletas = await fetch(
      "https://api.cartola.globo.com/atletas/mercado",
    );
    if (!resAtletas.ok) return null;
    const dadosAtletas = await resAtletas.json();

    const todosOsAtletas = dadosAtletas.atletas || [];

    // Mapeamento de posições do Cartola para ficar legível
    const posicoes = {
      1: "Goleiro",
      2: "Lateral",
      3: "Zagueiro",
      4: "Meia",
      5: "Atacante",
      6: "Técnico",
    };

    // Filtragem: Pega jogadores do time que estão com status 7 (Provável) ou que têm pontuação recente relevante
    // Se o time ainda não confirmou, pegamos os principais do elenco daquele ID de clube
    const extrairLista = (idClube) => {
      let filtrados = todosOsAtletas.filter((a) => a.clube_id === idClube);

      // Tenta priorizar quem está como provável (status_id === 7)
      let provaveis = filtrados.filter((a) => a.status_id === 7);

      // Se a rodada acabou de virar e ninguém tá como provável ainda, pega por média de pontos do elenco
      const elencoFinal =
        provaveis.length >= 11 ? provaveis : filtrados.slice(0, 12);

      return elencoFinal.map((a) => ({
        id: a.atleta_id,
        nome: a.apelido,
        posicao: posicoes[a.posicao_id] || "Jogador",
        foto: a.foto
          ? a.foto.replace("_CONTA.", "_140x140.")
          : "https://s.glbimg.com/es/ge/f/atleta/como-jogar/avatar_exemplo_140x140.png",
      }));
    };

    // 3. Monta o objeto final idêntico à estrutura que o seu Front-end/Service espera ler
    return {
      mandante: {
        treinador:
          extrairLista(idMandante).find((j) => j.posicao === "Técnico")?.nome ||
          "Técnico",
        titulares: extrairLista(idMandante)
          .filter((j) => j.posicao !== "Técnico")
          .slice(0, 11),
      },
      visitante: {
        treinador:
          extrairLista(idVisitante).find((j) => j.posicao === "Técnico")
            ?.nome || "Técnico",
        titulares: extrairLista(idVisitante)
          .filter((j) => j.posicao !== "Técnico")
          .slice(0, 11),
      },
    };
  } catch (erro) {
    console.error(
      `Erro ao gerar escalação para o jogo ${idJogo}:`,
      erro.message,
    );
    return null;
  }
}
