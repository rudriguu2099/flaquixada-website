import '../components/navbar.js';
import '../components/Footer.js';

async function carregarNoticias() {
    let noticias = [];

    try {
        const res = await fetch('http://localhost:4000/api/noticias');
        const data = await res.json();
        if (res.ok && data.success) {
            noticias = data.data;
        } else {
            console.error('Erro ao buscar notícias:', data.error);
        }
    } catch (e) {
        console.error('Back-end offline ou erro de rede.', e);
    }

    renderizarNoticias(noticias);
}

function renderizarNoticias(noticias) {
    const grid = document.getElementById('noticias-page-grid');
    if (!grid) return;

    grid.innerHTML = '';

    if (noticias.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #fff;">Nenhuma notícia disponível no momento.</p>';
        return;
    }

    noticias.forEach(noticia => {
        const card = document.createElement('article');
        card.className = 'noticia-card-page';

        // Formatação simples de data se vier no formato ISO
        let dataFormatada = noticia.data;
        try {
            const dateObj = new Date(noticia.data);
            if (!isNaN(dateObj.getTime())) {
                dataFormatada = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
            }
        } catch (e) {}

        card.innerHTML = `
            <div class="noticia-card-meta">
                <span class="noticia-categoria">${noticia.categoria}</span>
                <span class="noticia-data">${dataFormatada}</span>
            </div>
            <div class="noticia-card-page-body">
                <h3>${noticia.titulo}</h3>
                <p>${noticia.resumo}</p>
            </div>
        `;

        grid.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', carregarNoticias);
