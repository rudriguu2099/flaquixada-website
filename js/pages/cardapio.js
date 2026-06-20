const formataMoeda = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

async function carregarCardapio() {
    let dadosCardapioPage;
    try {
        const res = await fetch('http://localhost:3000/api/cardapio');
        if (res.ok) {
            dadosCardapioPage = await res.json();
        } else {
            dadosCardapioPage = obterCardapioLocal();
        }
    } catch (e) {
        console.log('Back-end offline. Usando dados mockados do localStorage.');
        dadosCardapioPage = obterCardapioLocal();
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

document.addEventListener('DOMContentLoaded', carregarCardapio);
