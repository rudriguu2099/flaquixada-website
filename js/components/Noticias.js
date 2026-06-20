const dadosNoticias = [
    {
        id: 1,
        titulo: 'Grande evento no Consulado neste sábado',
        resumo: 'Venha assistir ao jogo com a melhor torcida de Quixadá!',
        categoria: 'Eventos',
        link: '#'
    },
    {
        id: 2,
        titulo: 'Fla-Quixadá abre inscrições para novos sócios',
        resumo: 'Aproveite os benefícios exclusivos e faça parte dessa família!',
        categoria: 'Associação',
        link: '#'
    },
    {
        id: 3,
        titulo: 'Bolão da rodada: prêmio de R$ 200 em jogo',
        resumo: 'Participe e concorra a prêmios incríveis. Quanto mais você acerta, mais você ganha!',
        categoria: 'Bolão',
        link: '#'
    }
];

class Noticias extends HTMLElement {
    async connectedCallback() {
        try {
            const resposta = await fetch('./components_html/noticias.html');
            const htmlPuro = await resposta.text();

            this.innerHTML = `
                <link rel="stylesheet" href="./css/components/noticias.css">
                ${htmlPuro}
            `;
            
            this.renderizarNoticias();
        } catch (error) {
            console.error('Erro ao carregar o HTML do card de notícias:', error);
        }
    }

    renderizarNoticias() {
        const container = this.querySelector('.noticias-list');
        if (!container) return;

        dadosNoticias.forEach(noticia => {
            const item = document.createElement('div');
            item.className = 'noticia-item';
            
            item.innerHTML = `
                <div class="noticia-titulo-row">
                    <h3 class="noticia-titulo"><a href="${noticia.link}">${noticia.titulo}</a></h3>
                    <span class="noticia-categoria-badge">${noticia.categoria}</span>
                </div>
                <p class="noticia-resumo">${noticia.resumo}</p>
            `;
            container.appendChild(item);
        });
    }
}

customElements.define('noticias-fla', Noticias);