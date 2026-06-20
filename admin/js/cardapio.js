const CAMINHO_API = 'caminho_api';

document.addEventListener('DOMContentLoaded', () => {
    console.log("Admin Cardápio inicializado.");
    
    const btnNovo = document.getElementById('btn-novo-item');
    const containerLista = document.getElementById('admin-cardapio-list');
    let cardapioAtual = null;

    // ----- INICIALIZAÇÃO -----
    async function carregarDados() {
        try {
            const response = await fetch(CAMINHO_API);
            if (response.ok) {
                cardapioAtual = await response.json();
            } else {
                throw new Error("Backend indisponível");
            }
        } catch (error) {
            console.log("Usando dados do LocalStorage (Mock Fallback)");
            cardapioAtual = obterCardapioLocal();
        }
        renderizarCardapio();
    }

    // ----- RENDERIZAÇÃO -----
    function renderizarCardapio() {
        if (!containerLista || !cardapioAtual) return;
        containerLista.innerHTML = '';

        const categoriasMap = {
            'bebidas': { titulo: 'Bebidas', icone: 'ri-goblet-line' },
            'petiscos': { titulo: 'Petiscos', icone: 'ri-bowl-line' },
            'pratos': { titulo: 'Pratos', icone: 'ri-restaurant-2-line' }
        };

        for (const [chaveCategoria, conf] of Object.entries(categoriasMap)) {
            const itens = cardapioAtual[chaveCategoria] || [];
            
            const categoriaDiv = document.createElement('div');
            categoriaDiv.className = 'admin-categoria';
            categoriaDiv.id = `secao-${chaveCategoria}`;
            
            const tituloH3 = document.createElement('h3');
            tituloH3.innerHTML = `<i class="${conf.icone}"></i> ${conf.titulo}`;
            categoriaDiv.appendChild(tituloH3);

            const ul = document.createElement('ul');
            ul.className = 'admin-lista-itens';
            ul.id = `admin-lista-${chaveCategoria}`;

            if (itens.length === 0) {
                const liVazio = document.createElement('li');
                liVazio.className = 'admin-item';
                liVazio.innerHTML = `<span style="color:#999; padding: 16px;">Nenhum item cadastrado nesta categoria.</span>`;
                ul.appendChild(liVazio);
            } else {
                itens.forEach(item => {
                    const li = document.createElement('li');
                    li.className = 'admin-item';
                    li.innerHTML = `
                        <div class="item-info">
                            <span class="item-nome">${item.nome}</span>
                            <span class="item-descricao">${item.descricao || ''}</span>
                            <div class="item-precos">
                                <span class="preco-normal">Normal: R$ ${parseFloat(item.precoNormal).toFixed(2)}</span>
                                <span style="color: rgba(255,255,255,0.2);">|</span>
                                <span class="preco-socio">Sócio: R$ ${parseFloat(item.precoSocio).toFixed(2)}</span>
                            </div>
                        </div>
                        <div class="item-acoes">
                            <button class="btn-icon edit" data-id="${item.id}" data-categoria="${chaveCategoria}" title="Editar"><i class="ri-pencil-line"></i></button>
                            <button class="btn-icon delete" data-id="${item.id}" data-categoria="${chaveCategoria}" title="Excluir"><i class="ri-delete-bin-line"></i></button>
                        </div>
                    `;
                    ul.appendChild(li);
                });
            }

            categoriaDiv.appendChild(ul);
            containerLista.appendChild(categoriaDiv);
        }

        configurarAcoes();
    }

    // ----- EVENTOS E AÇÕES DA LISTA -----
    function configurarAcoes() {
        document.querySelectorAll('.btn-icon.edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const btnClicado = e.target.closest('.btn-icon');
                const id = parseInt(btnClicado.dataset.id);
                const cat = btnClicado.dataset.categoria;
                editarItem(id, cat);
            });
        });

        document.querySelectorAll('.btn-icon.delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const btnClicado = e.target.closest('.btn-icon');
                const id = parseInt(btnClicado.dataset.id);
                const cat = btnClicado.dataset.categoria;
                if(confirm("Tem certeza que deseja excluir este item?")) {
                    excluirItem(id, cat);
                }
            });
        });
    }

    // ----- ABERTURA DO MODAL-----
    if (btnNovo) {
        btnNovo.addEventListener('click', () => {
            limparFormulario();
            const componenteModal = document.querySelector('modal-cardapio');
            if(componenteModal && componenteModal.abrirModal) {
                componenteModal.abrirModal();
            }
        });
    }

    // ----- FORMULÁRIO E CRUD -----
    // Como o Modal é injetado via Web Component assíncrono, aguardamos um instante para conectar o submit do form
    setTimeout(() => {
        const form = document.getElementById('form-cardapio');
        if (form) {
            form.addEventListener('submit', salvarItem);
        }

        // Aplica os eventos de máscara globais
        const inputNome = document.getElementById('item-nome');
        const inputNormal = document.getElementById('item-preco-normal');
        const inputSocio = document.getElementById('item-preco-socio');
        
        if (inputNome) inputNome.addEventListener('input', mascaraTextoENumeros);
        if (inputNormal) inputNormal.addEventListener('input', mascaraMoeda);
        if (inputSocio) inputSocio.addEventListener('input', mascaraMoeda);
    }, 500);

    function limparFormulario() {
        const form = document.getElementById('form-cardapio');
        if(form) form.reset();
        const idInput = document.getElementById('item-id');
        if(idInput) idInput.value = '';
        const titulo = document.getElementById('modal-titulo');
        if(titulo) titulo.innerText = 'Novo Item';
    }

    function editarItem(id, categoria) {
        const item = cardapioAtual[categoria].find(i => i.id === id);
        if (!item) return;

        limparFormulario();
        
        document.getElementById('item-id').value = item.id;
        document.getElementById('item-nome').value = item.nome;
        document.getElementById('item-desc').value = item.descricao;
        document.getElementById('item-preco-socio').value = formatarMoedaInput(item.precoSocio);
        document.getElementById('item-preco-normal').value = formatarMoedaInput(item.precoNormal);
        document.getElementById('item-categoria').value = categoria;
        
        document.getElementById('modal-titulo').innerText = 'Editar Item';

        const componenteModal = document.querySelector('modal-cardapio');
        if(componenteModal && componenteModal.abrirModal) {
            componenteModal.abrirModal();
        }
    }

    async function salvarItem(e) {
        e.preventDefault();
        
        const id = document.getElementById('item-id').value;
        const nome = document.getElementById('item-nome').value;
        const descricao = document.getElementById('item-desc').value;
        const precoNormal = desmascararMoeda(document.getElementById('item-preco-normal').value);
        const precoSocio = desmascararMoeda(document.getElementById('item-preco-socio').value);
        const categoriaNova = document.getElementById('item-categoria').value;

        const novoItem = {
            id: id ? parseInt(id) : Date.now(), // Gera um ID único se for novo
            nome,
            descricao,
            precoSocio,
            precoNormal,
            categoria: categoriaNova
        };

        try {
            if (id) {
                // Remover das categorias antigas caso tenha mudado
                for (let cat in cardapioAtual) {
                    cardapioAtual[cat] = cardapioAtual[cat].filter(i => i.id !== parseInt(id));
                }
            }

            // Adiciona/Atualiza na categoria certa
            if(!cardapioAtual[categoriaNova]) {
                cardapioAtual[categoriaNova] = [];
            }
            cardapioAtual[categoriaNova].push(novoItem);

            // Persiste no localStorage
            salvarCardapioLocal(cardapioAtual);

            // Fecha Modal (ocultando a div via display)
            const modal = document.getElementById('modal-cardapio');
            if(modal) modal.style.display = 'none';

            // Atualiza tela
            renderizarCardapio();
            
        } catch (error) {
            console.error('Erro ao salvar item:', error);
            alert('Erro ao salvar item.');
        }
    }

    function excluirItem(id, categoria) {
        if (!cardapioAtual[categoria]) return;
        
        cardapioAtual[categoria] = cardapioAtual[categoria].filter(i => i.id !== id);
        salvarCardapioLocal(cardapioAtual);
        renderizarCardapio();
    }

    // Inicializa a tela
    carregarDados();

    // ----- INTEGRAÇÃO COM A DASHBOARD -----
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('action') === 'novo-item') {
        customElements.whenDefined('modal-cardapio').then(() => {
            limparFormulario();
            const componenteModal = document.querySelector('modal-cardapio');
            if(componenteModal && componenteModal.abrirModal) {
                componenteModal.abrirModal();
            }
            // Limpa a URL para não ficar com o parâmetro caso o usuário recarregue a página
            window.history.replaceState({}, document.title, window.location.pathname);
        });
    }
});
