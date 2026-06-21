class Noticias extends HTMLElement {
    async connectedCallback() {
        try {
            const resposta = await fetch('./components_html/noticias.html');
            const htmlPuro = await resposta.text();

            this.innerHTML = `
                <link rel="stylesheet" href="./css/components/noticias.css">
                ${htmlPuro}
            `;
            
            await this.carregarNoticias();
        } catch (error) {
            console.error('Erro ao carregar o HTML do card de notícias:', error);
        }
    }

    async carregarNoticias() {
        let noticias = [];
        try {
            const response = await fetch('http://localhost:4000/api/noticias');
            const data = await response.json();
            if (response.ok && data.success) {
                // Pega apenas as últimas 3 notícias para a home
                noticias = data.data.slice(0, 3);
            }
        } catch (error) {
            console.error('Erro ao buscar notícias da API:', error);
        }
        
        this.renderizarNoticias(noticias);
    }

    renderizarNoticias(noticias) {
        const container = this.querySelector('.noticias-list');
        if (!container) return;
        
        container.innerHTML = '';

        if (!noticias || noticias.length === 0) {
            container.innerHTML = '<p style="color: white; margin-top: 10px;">Nenhuma notícia disponível no momento.</p>';
            return;
        }

        noticias.forEach(noticia => {
            const item = document.createElement('div');
            item.className = 'noticia-item';
            
            item.innerHTML = `
                <div class="noticia-titulo-row">
                    <h3 class="noticia-titulo"><a href="noticias.html">${noticia.titulo}</a></h3>
                    <span class="noticia-categoria-badge">${noticia.categoria}</span>
                </div>
                <p class="noticia-resumo">${noticia.resumo}</p>
            `;
            container.appendChild(item);
        });
    }
}

customElements.define('noticias-fla', Noticias);