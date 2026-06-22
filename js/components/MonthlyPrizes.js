class MonthlyPrizes extends HTMLElement {
    async connectedCallback() {
        try {
            // Busca o arquivo HTML atualizado
            const response = await fetch('./components_html/monthlyPrizes.html');
            const pureHtml = await response.text();

            this.innerHTML = `
                <link rel="stylesheet" href="./css/components/monthlyPrizes.css">
                ${pureHtml}
            `;

            this.setupButton();

        } catch (error) {
            console.error('Erro ao carregar o HTML do monthly-prizes:', error);
        }
    }

    setupButton() {
        const btnCompete = this.querySelector('#btn-compete');
        if (btnCompete) {
            btnCompete.addEventListener('click', () => {
                const mensagem = "Olá! Gostaria de concorrer aos prêmios mensais do Fla-Quixadá.";
                const whatsappUrl = `https://wa.me/5588981942857?text=${encodeURIComponent(mensagem)}`;
                window.open(whatsappUrl, '_blank');
            });
        }
    }
}

customElements.define('monthly-prizes', MonthlyPrizes);