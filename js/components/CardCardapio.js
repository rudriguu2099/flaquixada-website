class CardCardapio extends HTMLElement {
    async connectedCallback() {
        try {
            const resposta = await fetch('./components_html/cardCardapio.html');
            const htmlPuro = await resposta.text();
            
            this.innerHTML = `
                <link rel="stylesheet" href="./css/components/cardCardapio.css">
                ${htmlPuro}
            `;

            let dadosCardapio = await this.carregarDadosDaAPI();

            this.renderizarLista('lista-bebidas', dadosCardapio.bebidas);
            this.renderizarLista('lista-petiscos', dadosCardapio.petiscos);
            this.renderizarLista('lista-pratos', dadosCardapio.pratos);

        } catch (erro) {
            console.error("Erro ao renderizar CardCardapio:", erro);
        }
    }

    async carregarDadosDaAPI() {
        try {
            const res = await fetch('http://localhost:3000/api/cardapio');
            if (res.ok) {
                return await res.json();
            }
        } catch (e) {
            console.log("Back-end offline. Usando dados mockados do localStorage.");
        }
        return obterCardapioLocal();
    }

    renderizarLista(idLista, itens, limite = 3) {
        const ul = this.querySelector(`#${idLista}`);
        if (!ul) return;

        ul.innerHTML = '';
        const itensLimitados = itens.slice(0, limite);

        itensLimitados.forEach(item => {
            const li = document.createElement('li');
            li.className = 'cardapio-item';
            
            const formataMoeda = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            li.innerHTML = `
                <div class="item-info">
                    <span class="item-nome">${item.nome}</span>
                    <span class="item-descricao">${item.descricao}</span>
                </div>
                <div class="tabela-precos">
                    <span class="col-socio preco-destaque">${formataMoeda(item.precoSocio)}</span>
                    <span class="col-divisor">|</span>
                    <span class="col-normal preco-comum">${formataMoeda(item.precoNormal)}</span>
                </div>
            `;

            ul.appendChild(li);
        });
    }
}

customElements.define('card-cardapio', CardCardapio);
