class NextGame extends HTMLElement {
    async connectedCallback() {
        try {
            //Busca o arquivo HTML
            const resposta = await fetch('./components_html/nextGame.html');
            const htmlPuro = await resposta.text();

            //Injeta o CSS
            this.innerHTML = `
                <link rel="stylesheet" href="./css/components/nextGame.css">
                ${htmlPuro}
            `
        } catch (error) {
            console.error('Erro ao carregar o HTML do card-next-game:', error);
        }
    }
}

customElements.define('next-game', NextGame);