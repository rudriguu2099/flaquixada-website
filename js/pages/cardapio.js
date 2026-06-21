import { ApiCardapioService } from '../services/ApiCardapioService.js';
import '../components/navbar.js';
import '../components/Footer.js';

const formataMoeda = (v) => {
    // Caso v seja undefined ou não numérico, retorna R$ 0,00 para não quebrar a tela
    if (v === undefined || v === null) return 'R$ 0,00';
    return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

async function carregarCardapio() {
    let dadosCardapioPage;
    try {
        dadosCardapioPage = await ApiCardapioService.fetchCardapio();
    } catch (e) {
        console.error('Erro ao carregar cardápio da API', e);
        // Fallback visual de erro
        dadosCardapioPage = { bebidas: [], petiscos: [], pratos: [] };
        alert("O cardápio está temporariamente indisponível.");
    }

    renderizarLista('page-lista-bebidas',  dadosCardapioPage.bebidas);
    renderizarLista('page-lista-petiscos', dadosCardapioPage.petiscos);
    renderizarLista('page-lista-pratos',   dadosCardapioPage.pratos);
}

function renderizarLista(idLista, itens) {
    const ul = document.getElementById(idLista);
    if (!ul) return;

    ul.innerHTML = '';

    itens.forEach(item => {
        const li = document.createElement('li');
        li.className = 'cardapio-page-item';

        li.innerHTML = `
            <div class="item-info">
                <span class="item-nome">${item.nome}</span>
                <span class="item-descricao">${item.descricao}</span>
            </div>
            <div class="tabela-precos">
                <span class="col-socio">${formataMoeda(item.precoSocio)}</span>
                <span class="col-divisor">|</span>
                <span class="col-normal">${formataMoeda(item.precoNormal)}</span>
            </div>
        `;

        ul.appendChild(li);
    });
}

carregarCardapio();
