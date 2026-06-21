class CardNextGame extends HTMLElement {
    //recebe a lista completa de jogos
    constructor(listaJogos, isPlaceholder = false) {
        super();
        this.listaJogos = listaJogos || [];
        this.isPlaceholder = isPlaceholder;
    }

    async connectedCallback() {
        try {
            const resposta = await fetch('./components_html/cardNextGame.html');
            const htmlPuro = await resposta.text();
            
            this.innerHTML = `
                <link rel="stylesheet" href="./css/components/cardNextGame.css">
                ${htmlPuro}
            `;
            
            if (this.listaJogos.length > 0) {
                // Separa o primeiro jogo do resto da lista
                const [primeiroJogo, ...jogosSeguintes] = this.listaJogos;
                
                // 1. Preenche os dados do jogo principal de destaque
                this.querySelector('#team-home-name').textContent = primeiroJogo.timeCasa;
                this.querySelector('#team-home-img').src = primeiroJogo.escudoCasa;
                this.querySelector('#team-visiting-name').textContent = primeiroJogo.timeFora;
                this.querySelector('#team-visiting-img').src = primeiroJogo.escudoFora;
                this.querySelector('#championship').textContent = primeiroJogo.campeonato;
                this.querySelector('#stage').textContent = primeiroJogo.faseRodada;
                this.querySelector('#time').textContent = primeiroJogo.horario;
                this.querySelector('#date-day').textContent = primeiroJogo.diaSemana;
                this.querySelector('#date').textContent = primeiroJogo.dataExtenso;
                
                // Tratar Placar e Status
                const scoreContainer = this.querySelector('#match-score-container');
                const titleHeader = this.querySelector('#title-next-game h2');
                
                const customTitle = this.getAttribute('custom-title');
                const customIcon = this.getAttribute('custom-icon') || 'ri-calendar-line';
                
                if (customTitle && titleHeader) {
                    titleHeader.innerHTML = `<i class="${customIcon}"></i> ${customTitle}`;
                } else if (titleHeader) {
                    if (primeiroJogo.statusTipo === 'inprogress') {
                        titleHeader.innerHTML = `<i class="ri-live-line"></i> Jogo Atual`;
                    } else if (primeiroJogo.statusTipo === 'finished') {
                        titleHeader.innerHTML = `<i class="ri-checkbox-circle-line"></i> Último Jogo`;
                    } else {
                        titleHeader.innerHTML = `<i class="ri-calendar-line"></i> Próximo Jogo`;
                    }
                }

                if (primeiroJogo.placar && scoreContainer) {
                    scoreContainer.innerHTML = `
                        <div class="score-display" style="display: flex; flex-direction: column; align-items: center;">
                            <div style="font-size: 2.5rem; font-weight: 700; color: white;">
                                ${primeiroJogo.placar.casa} <span style="font-size: 1.5rem; color: #999; margin: 0 5px;">X</span> ${primeiroJogo.placar.visitante}
                            </div>
                            <span style="font-size: 0.8rem; background: var(--red-fla); color: white; padding: 2px 8px; border-radius: 4px; margin-top: -5px; font-weight: 600;">
                                ${primeiroJogo.placar.status}
                            </span>
                        </div>
                    `;
                }
                
                // 2. Renderiza a lista de próximos jogos
                const blocoLista = this.querySelector('#see-more-block');
                if (blocoLista) {
                    jogosSeguintes.forEach((jogo, index) => {
                        const itemLista = new NextGame(jogo);
                        blocoLista.appendChild(itemLista);
                        
                        // Cria e adiciona a linha divisória (hr)
                        if (index < jogosSeguintes.length - 1) {
                            const divisor = document.createElement('hr');
                            divisor.className = 'lista-jogos-divisor'; 
                            blocoLista.appendChild(divisor);
                        }
                    });
                }
            }

            this.configurarBotaoVerMais();

        } catch (error) {
            console.error('Erro ao carregar o HTML do card-next-game:', error);
        }
    }

    configurarBotaoVerMais() {
        const btnVerMais = this.querySelector('#btn-see-more-next-game');
        const blocoLista = this.querySelector('#see-more-block');

        if (btnVerMais && blocoLista) {
            btnVerMais.addEventListener('click', () => {
                blocoLista.classList.toggle('expandido');
                
                const estaExpandido = blocoLista.classList.contains('expandido');
                btnVerMais.innerHTML = estaExpandido 
                    ? `Ver Menos <i class="ri-arrow-up-s-line"></i>` 
                    : `Ver Mais <i class="ri-arrow-down-s-line"></i>`;
            });
        }
    }
}

customElements.define('card-next-game', CardNextGame);
window.CardNextGame = CardNextGame;