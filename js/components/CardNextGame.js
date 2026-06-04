class CardNextGame extends HTMLElement {
    async connectedCallback() {
        try {
            //Busca o arquivo HTML
            const resposta = await fetch('./components_html/cardNextGame.html');
            const htmlPuro = await resposta.text();

            //Injeta o CSS
            this.innerHTML = `
                <link rel="stylesheet" href="./css/components/cardNextGame.css">
                ${htmlPuro}
            `
        } catch (error) {
            console.error('Erro ao carregar o HTML do card-next-game:', error);
        }
    }
}

customElements.define('card-next-game', CardNextGame);