import './components/AdminSidebar.js';
import './components/AdminHeader.js';
import './components/modalProduto.js';
import { ApiProdutoService } from '../../js/services/ApiProdutoService.js';

console.log("Admin Loja inicializado.");

const btnNovo = document.getElementById('btn-novo-item');
let produtosAtuais = [];

// ----- INICIALIZAÇÃO -----
async function carregarDados() {
    const container = document.getElementById('admin-produtos-list');
    if (container) {
        container.innerHTML = '<p style="color: #999; padding: 20px;">Carregando produtos...</p>';
    }

    try {
        produtosAtuais = await ApiProdutoService.fetchProdutos();
    } catch (error) {
        console.error('Erro ao carregar produtos da API:', error);
        produtosAtuais = [];
    }

    renderizarProdutos();
}

// ----- RENDERIZAÇÃO -----
function renderizarProdutos() {
    const container = document.getElementById('admin-produtos-list');
    if (!container) return;

    container.innerHTML = '';

    if (produtosAtuais.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding: 40px; color: rgba(255,255,255,0.3);">
                <i class="ri-inbox-line" style="font-size: 3rem;"></i>
                <p>Nenhum produto cadastrado na loja.</p>
            </div>
        `;
        return;
    }

    produtosAtuais.forEach(produto => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'admin-item-loja';

        // Timestamp de cache-buster: força o browser a não usar a imagem antiga após edição
        const imagemSrc = ApiProdutoService.getUrlFoto(produto._id) + `?t=${produto.updatedAt || Date.now()}`;

        itemDiv.innerHTML = `
            <div class="item-loja-main">
                <img src="${imagemSrc}" class="item-loja-thumb" alt="${produto.nome}" onerror="this.src='https://placehold.co/50x50/242424/aaa?text=S/F'">
                <div class="item-loja-info">
                    <span class="item-loja-nome">${produto.nome}</span>
                    <span class="item-loja-desc">${produto.descricao || 'Sem descrição'}</span>
                    <span class="item-loja-preco">R$ ${parseFloat(produto.preco).toFixed(2)}</span>
                </div>
            </div>

            <div class="item-loja-acoes">
                <button class="btn-icon edit" data-id="${produto._id}" title="Editar">
                    <i class="ri-pencil-line"></i>
                </button>
                <button class="btn-icon delete" data-id="${produto._id}" title="Excluir">
                    <i class="ri-delete-bin-line"></i>
                </button>
            </div>
        `;

        container.appendChild(itemDiv);
    });

    configurarAcoes();
}

// ----- EVENTOS E AÇÕES DA LISTA -----
function configurarAcoes() {
    document.querySelectorAll('.btn-icon.edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('.btn-icon').dataset.id;
            editarProduto(id);
        });
    });

    document.querySelectorAll('.btn-icon.delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('.btn-icon').dataset.id;
            if (confirm('Tem certeza que deseja excluir este produto?')) {
                excluirProduto(id);
            }
        });
    });
}

// ----- ABERTURA DO MODAL -----
if (btnNovo) {
    btnNovo.addEventListener('click', () => {
        limparFormulario();
        const modalProduto = document.querySelector('modal-produto');
        if (modalProduto && modalProduto.abrirModal) {
            modalProduto.abrirModal(null); // null = modo criação
        }
    });
}

// ----- CRUD -----
function limparFormulario() {
    const form = document.getElementById('form-produto');
    if (form) form.reset();

    const idInput = document.getElementById('produto-id');
    if (idInput) idInput.value = '';

    const titulo = document.getElementById('modal-produto-title');
    if (titulo) titulo.innerText = 'Novo Produto';

    const preview = document.getElementById('preview-imagem-produto');
    if (preview) preview.src = '';
}

function editarProduto(id) {
    const produto = produtosAtuais.find(p => p._id === id);
    if (!produto) return;

    limparFormulario();

    document.getElementById('produto-id').value = produto._id;
    document.getElementById('produto-nome').value = produto.nome;
    document.getElementById('produto-descricao').value = produto.descricao || '';
    document.getElementById('produto-preco').value = produto.preco;

    const preview = document.getElementById('preview-imagem-produto');
    if (preview) preview.src = ApiProdutoService.getUrlFoto(produto._id) + `?t=${Date.now()}`;

    document.getElementById('modal-produto-title').innerText = 'Editar Produto';

    const modalProduto = document.querySelector('modal-produto');
    if (modalProduto && modalProduto.abrirModal) {
        modalProduto.abrirModal(produto); // passa o produto = modo edição
    }
}

async function salvarProduto(e) {
    e.preventDefault();

    const id = document.getElementById('produto-id').value;
    const nome = document.getElementById('produto-nome').value.trim();
    const descricao = document.getElementById('produto-descricao').value.trim();
    const preco = parseFloat(document.getElementById('produto-preco').value);

    // Pega o Base64 gerado pelo componente do modal
    const modalProduto = document.querySelector('modal-produto');
    const fotoBase64 = modalProduto ? modalProduto.getBase64Atual() : null;

    // Na criação, a foto é obrigatória
    if (!id && !fotoBase64) {
        alert('Selecione uma imagem para o produto.');
        return;
    }

    const payload = { nome, descricao, preco };
    if (fotoBase64) {
        payload.fotoBase64 = fotoBase64;
    }

    const btnSubmit = document.querySelector('#form-produto button[type="submit"]');
    const originalText = btnSubmit ? btnSubmit.innerHTML : 'Salvar';
    if (btnSubmit) { btnSubmit.innerHTML = 'Salvando...'; btnSubmit.disabled = true; }

    try {
        if (id) {
            await ApiProdutoService.editarProduto(id, payload);
        } else {
            await ApiProdutoService.criarProduto(payload);
        }

        if (modalProduto && modalProduto.fecharModal) {
            modalProduto.fecharModal();
        }

        await carregarDados();

    } catch (error) {
        console.error('Erro ao salvar produto:', error);
        alert(`Erro ao salvar produto: ${error.message}`);
    } finally {
        if (btnSubmit) { btnSubmit.innerHTML = originalText; btnSubmit.disabled = false; }
    }
}

async function excluirProduto(id) {
    try {
        await ApiProdutoService.excluirProduto(id);
        await carregarDados();
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        alert(`Erro ao excluir produto: ${error.message}`);
    }
}

// ----- BIND DO FORMULÁRIO (aguarda Web Component carregar) -----
// O modal é um Web Component assíncrono, então aguardamos ele estar pronto
customElements.whenDefined('modal-produto').then(() => {
    setTimeout(() => {
        const form = document.getElementById('form-produto');
        if (form) {
            form.addEventListener('submit', salvarProduto);
        }
    }, 300);
});

// ----- INTEGRAÇÃO COM PARÂMETROS URL -----
carregarDados();

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('action') === 'novo-produto') {
    customElements.whenDefined('modal-produto').then(() => {
        setTimeout(() => {
            limparFormulario();
            const modalProduto = document.querySelector('modal-produto');
            if (modalProduto && modalProduto.abrirModal) {
                modalProduto.abrirModal(null);
            }
            window.history.replaceState({}, document.title, window.location.pathname);
        }, 300);
    });
}