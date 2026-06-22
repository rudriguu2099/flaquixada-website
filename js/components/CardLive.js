class CardLive extends HTMLElement {
    //recebe a lista completa da escalação
    constructor(matchData) {
        super();
        this.matchData  = matchData  || {};
    }

    async connectedCallback() {
    try {
      // Busca o arquivo HTML
      const resposta = await fetch('./components_html/cardLive.html');
      const htmlPuro = await resposta.text();

      // Injeta o CSS e o HTML
      this.innerHTML = `
        <link rel="stylesheet" href="./css/components/cardLive.css">
        ${htmlPuro}
      `;

      this.preencherDadosPartida();
      this.preencherEscalacao();
      this.configurarLineup();

    } catch (error) {
      console.error('Erro ao carregar o HTML do CardLive:', error);
    }
  }

  configurarLineup() {
        const btnLineup = this.querySelector('#btn-team-lineup');
        const blocoLista = this.querySelector('#team-lineup-block');

        if (btnLineup && blocoLista) {
            btnLineup.addEventListener('click', () => {
                blocoLista.classList.toggle('expandido');
                
                const estaExpandido = blocoLista.classList.contains('expandido');
                btnLineup.innerHTML = estaExpandido 
                    ? `Escalação <i class="ri-arrow-up-s-line"></i>` 
                    : `Escalação <i class="ri-arrow-down-s-line"></i>`;
            });
        }
  }

  preencherDadosPartida() {
    const data = this.matchData;

    this.querySelector('#championship').textContent =
        data.championship;

    this.querySelector('#time-game').textContent =
        data.timeGame;

    this.querySelector('#stage').textContent =
        data.stage;

    this.querySelector('#team-home-name').textContent =
        data.homeTeam.name;

    this.querySelector('#team-home-img').src =
        data.homeTeam.logo;

    this.querySelector('#team-visiting-name').textContent =
        data.awayTeam.name;

    this.querySelector('#team-visiting-img').src =
        data.awayTeam.logo;

    this.querySelector('#time').textContent =
        data.score.home;

    this.querySelector('#stadium').textContent =
        data.score.away;
  }

  preencherEscalacao() {
    const blocoLista = this.querySelector('#team-lineup-block');

    if (!blocoLista) return;

    this.matchData.lineup.forEach(jogador => {
        blocoLista.insertAdjacentHTML(
            'beforeend',
            `
            <div class="player">
                <p>${jogador.posicao}</p>
                <p>${jogador.jogador}</p>
            </div>
            `
        );
    });
  }
}

customElements.define('card-live-fla', CardLive);