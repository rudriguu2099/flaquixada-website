class CardItemStore extends HTMLElement {
    async connectedCallback() {
        try {
            const resposta = await fetch('./components_html/cardItemStore.html');
            const htmlPuro = await resposta.text();

            this.innerHTML = `
                <link rel="stylesheet" href="./css/components/cardItemStore.css">
                ${htmlPuro}
            `;

            this.renderCard();

        } catch (error) {
            console.error('Erro ao carregar o HTML do CardItemStore:', error);
        }
    }

    renderCard() {
        const img = this.getAttribute('img') || '';
        const title = this.getAttribute('title') || 'Produto';
        const description = this.getAttribute('description') || '';
        const price = this.getAttribute('price') || '0,00 R$';

        const imgEl = this.querySelector('#product-img');
        const titleEl = this.querySelector('#product-title');
        const descEl = this.querySelector('#product-description');
        const btnTextEl = this.querySelector('#btn-text');
        const btnBuyEl = this.querySelector('#btn-buy-store'); // Captura o botão inteiro

        if (imgEl) imgEl.src = img;
        if (titleEl) titleEl.textContent = title;
        if (descEl) descEl.textContent = description;
        if (btnTextEl) btnTextEl.textContent = `Comprar - ${price}`;

        //  CLIQUE PARA O WHATSAPP 
        if (btnBuyEl) {
            btnBuyEl.addEventListener('click', () => {
                const mensagem = `Olá! Gostaria de comprar o produto: *${title}* no valor de *${price}*.`;
                
                const urlWhatsapp = `https://wa.me/88981942857?text=${encodeURIComponent(mensagem)}`;
                
                window.open(urlWhatsapp, '_blank');
            });
        }
    }
}

customElements.define('card-item-fla', CardItemStore);