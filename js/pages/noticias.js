// js/pages/noticias.js
const dadosNoticiasPage = [
    {
        id: 1,
        titulo: 'Grande evento no Consulado neste sábado!',
        resumo: 'Venha assistir ao clássico do Flamengo com a melhor torcida de Quixadá. Chope gelado, petiscos e muita emoção te esperam.',
        categoria: 'Eventos',
        data: '14 Jun 2025',
        link: '#'
    },
    {
        id: 2,
        titulo: 'Fla-Quixadá abre inscrições para novos sócios',
        resumo: 'O Consulado Fla-Quixadá está com inscrições abertas para novos associados. Aproveite os benefícios exclusivos e faça parte dessa família!',
        categoria: 'Associação',
        data: '10 Jun 2025',
        link: '#'
    },
    {
        id: 3,
        titulo: 'Bolão da rodada: prêmio de R$ 200 em jogo',
        resumo: 'Participe do bolão desta semana e concorra a prêmios incríveis. Quanto mais você acerta, mais você ganha!',
        categoria: 'Bolão',
        data: '07 Jun 2025',
        link: '#'
    },
    {
        id: 4,
        titulo: 'Novo cardápio disponível com preços especiais',
        resumo: 'Renovamos nosso cardápio com novos pratos e petiscos. Sócios têm acesso a preços diferenciados em todos os itens.',
        categoria: 'Cardápio',
        data: '01 Jun 2025',
        link: '#'
    },
    {
        id: 5,
        titulo: 'Mengo na final! Vem comemorar conosco',
        resumo: 'O Flamengo está na final e o Consulado vai ser o ponto de encontro da torcida. Confirme sua presença!',
        categoria: 'Eventos',
        data: '28 Mai 2025',
        link: '#'
    },
    {
        id: 6,
        titulo: 'Transmissão ao vivo: Flamengo x Fluminense',
        resumo: 'O clássico carioca vai ser transmitido em telão no Consulado. Reserve seu lugar e venha torcer com a gente!',
        categoria: 'Eventos',
        data: '21 Mai 2025',
        link: '#'
    }
];

async function carregarNoticias() {
    let noticias = dadosNoticiasPage;

    try {
        const res = await fetch('http://localhost:3000/api/noticias');
        if (res.ok) noticias = await res.json();
    } catch (e) {
        console.log('Back-end offline. Usando dados mockados.');
    }

    renderizarNoticias(noticias);
}

function renderizarNoticias(noticias) {
    const grid = document.getElementById('noticias-page-grid');
    if (!grid) return;

    grid.innerHTML = '';

    noticias.forEach(noticia => {
        const card = document.createElement('article');
        card.className = 'noticia-card-page';

        card.innerHTML = `
            <div class="noticia-card-meta">
                <span class="noticia-categoria">${noticia.categoria}</span>
                <span class="noticia-data">${noticia.data}</span>
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
