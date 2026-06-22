class NextGame extends HTMLElement {
    constructor(jogoData) {
        super();
        this.jogo = jogoData;
    }

    async connectedCallback() {
        try {
            const resposta = await fetch('./components_html/nextGame.html');
            const htmlPuro = await resposta.text();

            this.innerHTML = `
                <link rel="stylesheet" href="./css/components/nextGame.css">
                ${htmlPuro}
            `;

            if (this.jogo) {
                // Injeta os dados mapeados do padrão único do JSON
                this.querySelector('#championship').textContent = this.jogo.campeonato;
                this.querySelector('#stage').textContent = this.jogo.faseRodada;
                this.querySelector('#main-team').textContent = this.jogo.timeCasa;
                this.querySelector('#visiting-team').textContent = this.jogo.timeFora;
                this.querySelector('#date').textContent = this.jogo.dataFormatada;
                
                if (this.jogo.placar) {
                    this.querySelector('#vs-or-score').innerHTML = `<span class="live-score-badge">${this.jogo.placar.casa} x ${this.jogo.placar.visitante}</span>`;
                    this.querySelector('#time').textContent = this.jogo.placar.status;
                } else {
                    this.querySelector('#vs-or-score').textContent = 'X';
                    this.querySelector('#time').textContent = this.jogo.horario;
                }

                // Lógica da barrinha: Se o Flamengo jogar em casa (Time Casa), bota a cor vermelha do Fla
                const barrinha = this.querySelector('.block');
                if (barrinha) {
                    if (this.jogo.timeCasa.toUpperCase() === 'FLAMENGO') {
                        barrinha.style.backgroundColor = 'var(--red-fla)';
                    } else {
                        barrinha.style.backgroundColor = 'var(--black-fla)'; 
                    }
                }
            }
        } catch (error) {
            console.error('Erro ao carregar o HTML do next-game:', error);
        }
    }
}

customElements.define('next-game', NextGame);
window.NextGame = NextGame;