if (!localStorage.getItem('user')) {
    const adminFalso = {
        name: "Admin Provisório",
        role: "admin",
        token: "mocked-jwt-token-xyz123"
    };
    localStorage.setItem('user', JSON.stringify(adminFalso));
}

/* Jogos Testes */
const proximosJogosMock = [
  {
    "campeonato": "Brasileirão",
    "faseRodada": "Rodada 21",
    "timeCasa": "FLAMENGO",
    "escudoCasa": "https://images.seeklogo.com/logo-png/5/2/flamengo-logo-png_seeklogo-55627.png",
    "timeFora": "ADVERSÁRIO",
    "escudoFora": "https://images.seeklogo.com/logo-png/5/2/flamengo-logo-png_seeklogo-55627.png",
    "horario": "19:00",
    "estadio": "Maracanã",
    "diaSemana": "SÁBADO",
    "dataExtenso": "24 DE MAIO",
    "dataFormatada": "24/05/2026"
  },
  {
    "campeonato": "Brasileirão",
    "faseRodada": "Rodada 24",
    "timeCasa": "FLAMENGO",
    "escudoCasa": "https://images.seeklogo.com/logo-png/5/2/flamengo-logo-png_seeklogo-55627.png",
    "timeFora": "ADVERSÁRIO",
    "escudoFora": "https://images.seeklogo.com/logo-png/5/2/flamengo-logo-png_seeklogo-55627.png",
    "horario": "19:00",
    "estadio": "Maracanã",
    "diaSemana": "TERÇA-FEIRA",
    "dataExtenso": "12 DE MAIO",
    "dataFormatada": "12/05/2026"
  },
  {
    "campeonato": "Brasileirão",
    "faseRodada": "Rodada 25",
    "timeCasa": "ADVERSÁRIO",
    "escudoCasa": "https://images.seeklogo.com/logo-png/5/2/flamengo-logo-png_seeklogo-55627.png",
    "timeFora": "FLAMENGO",
    "escudoFora": "https://images.seeklogo.com/logo-png/5/2/flamengo-logo-png_seeklogo-55627.png",
    "horario": "21:30",
    "estadio": "Allianz Parque",
    "diaSemana": "SÁBADO",
    "dataExtenso": "16 DE MAIO",
    "dataFormatada": "16/05/2026"
  },
  {
    "campeonato": "Copa do Brasil",
    "faseRodada": "Semi-final",
    "timeCasa": "ADVERSÁRIO",
    "escudoCasa": "https://images.seeklogo.com/logo-png/5/2/flamengo-logo-png_seeklogo-55627.png",
    "timeFora": "FLAMENGO",
    "escudoFora": "https://images.seeklogo.com/logo-png/5/2/flamengo-logo-png_seeklogo-55627.png",
    "horario": "21:30",
    "estadio": "Castelão",
    "diaSemana": "QUARTA-FEIRA",
    "dataExtenso": "20 DE MAIO",
    "dataFormatada": "20/05/2026"
  }
];



document.addEventListener('DOMContentLoaded', () => {
    const containerPrincipal = document.getElementById('match-fla');

    if (!containerPrincipal || proximosJogosMock.length === 0) return;

    // Passa a lista COMPLETA de jogos diretamente para o construtor do componente
    const cardDestaque = new CardNextGame(proximosJogosMock);
    containerPrincipal.appendChild(cardDestaque);
});



/* JOGO AO VIVO */
/* Teste de Escalação */
const matchData = {
    championship: "Brasileirão",
    stage: "Rodada 24",
    timeGame: "67'",

    homeTeam: {
        name: "FLAMENGO",
        logo: "https://images.seeklogo.com/logo-png/5/2/flamengo-logo-png_seeklogo-55627.png"
    },

    awayTeam: {
        name: "PALMEIRAS",
        logo: "https://logodetimes.com/times/palmeiras/logo-palmeiras-256.png"
    },

    score: {
        home: 3,
        away: 0
    },

    lineup: [
        { posicao: "GL", jogador: "Rossi" },
        { posicao: "LD", jogador: "E. Royal" },
        { posicao: "ZAG", jogador: "L. Pereira" },
        { posicao: "ZAG", jogador: "L. Ortiz" },
        { posicao: "LE", jogador: "Ayrton Lucas" },
        { posicao: "VOL", jogador: "Pulgar" },
        { posicao: "VOL", jogador: "Jorginho" },
        { posicao: "MA", jogador: "Arrascaeta" },
        { posicao: "PE", jogador: "Samuel Lino" },
        { posicao: "CA", jogador: "Pedro" },
        { posicao: "PD", jogador: "Paquetá" }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    const containerPrincipal = document.getElementById('match-live');

    if (!containerPrincipal || Object.keys(matchData).length === 0) return;

    // Passa a lista COMPLETA da escalação diretamente para o construtor do componente
    const cardDestaque = new CardLive(matchData);
    containerPrincipal.appendChild(cardDestaque);
});