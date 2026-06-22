import './components/AdminSidebar.js';
import './components/AdminHeader.js';
import './components/modalProduto.js';
import { obterProdutosLocal, salvarProdutosLocal } from '../../js/utils/mockProdutos.js';

const CAMINHO_API = 'sua_api_aqui/produtos';

console.log("Admin Loja inicializado.");
    
const btnNovo = document.getElementById('btn-novo-item');
const containerLista = document.getElementById('admin-produtos-list');
let produtosAtuais = [];

// ----- INICIALIZAÇÃO -----
async function carregarDados() {
    try {
        const response = await fetch(CAMINHO_API);
        if (response.ok) {
            produtosAtuais = await response.json();
        } else {
            throw new Error("Backend indisponível");
        }
    } catch (error) {
        console.log("Usando dados do LocalStorage (Mock Fallback para Loja)");
        produtosAtuais = obterProdutosLocal();
    }
    renderizarProdutos();
}

// ----- RENDERIZAÇÃO -----
function renderizarProdutos() {
    const container = document.getElementById('admin-produtos-list');
    if (!container) return;

    container.innerHTML = ''; // Limpa a lista antes de renderizar

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
        
        const imagemSrc = produto.imagem || 'https://via.placeholder.com/50?text=S/F';

        itemDiv.innerHTML = `
            <div class="item-loja-main">
                <img src="${imagemSrc}" class="item-loja-thumb" alt="${produto.nome}">
                <div class="item-loja-info">
                    <span class="item-loja-nome">${produto.nome}</span>
                    <span class="item-loja-desc">${produto.descricao || 'Sem descrição'}</span>
                    <span class="item-loja-preco">R$ ${parseFloat(produto.preco).toFixed(2)}</span>
                </div>
            </div>
            
            <div class="item-loja-acoes">
                <button class="btn-acao edit" data-id="${produto.id}" title="Editar">
                    <i class="ri-pencil-line"></i>
                </button>
                <button class="btn-acao delete" data-id="${produto.id}" title="Excluir">
                    <i class="ri-delete-bin-line"></i>
                </button>
            </div>
        `;

        container.appendChild(itemDiv);
    });

    // Reatribui os eventos aos novos botões criados
    configurarAcoes();
}

// ----- EVENTOS E AÇÕES DA LISTA -----
function configurarAcoes() {
    // CORRIGIDO: Seletor alterado de '.btn-icon.edit' para '.btn-acao.edit'
    document.querySelectorAll('.btn-acao.edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const btnClicado = e.target.closest('.btn-acao');
            const id = parseInt(btnClicado.dataset.id);
            editarProduto(id);
        });
    });

    // CORRIGIDO: Seletor alterado de '.btn-icon.delete' para '.btn-acao.delete'
    document.querySelectorAll('.btn-acao.delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const btnClicado = e.target.closest('.btn-acao');
            const id = parseInt(btnClicado.dataset.id);
            if(confirm("Tem certeza que deseja excluir este produto?")) {
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
        if(modalProduto && modalProduto.abrirModal) {
            modalProduto.abrirModal();
        }
    });
}

// ----- FORMULÁRIO E CRUD -----
setTimeout(() => {
    const form = document.getElementById('form-produto');
    if (form) {
        form.addEventListener('submit', salvarProduto);
    }
}, 500);

function limparFormulario() {
    const form = document.getElementById('form-produto');
    if(form) form.reset();
    
    const idInput = document.getElementById('produto-id');
    if(idInput) idInput.value = '';
    
    const titulo = document.getElementById('modal-produto-title');
    if(titulo) titulo.innerText = 'Novo Produto';

    const preview = document.getElementById('preview-imagem-produto');
    if(preview) preview.src = ''; 
}

function editarProduto(id) {
    const produto = produtosAtuais.find(p => p.id === id);
    if (!produto) return;

    limparFormulario();
    
    document.getElementById('produto-id').value = produto.id;
    document.getElementById('produto-nome').value = produto.nome;
    document.getElementById('produto-descricao').value = produto.descricao || '';
    document.getElementById('produto-preco').value = produto.preco;
    
    const preview = document.getElementById('preview-imagem-produto');
    if(preview && produto.imagem) preview.src = produto.imagem;
    
    document.getElementById('modal-produto-title').innerText = 'Editar Produto';

    const modalProduto = document.querySelector('modal-produto');
    if(modalProduto && modalProduto.abrirModal) {
        modalProduto.abrirModal();
    }
}

async function salvarProduto(e) {
    e.preventDefault();
    
    const id = document.getElementById('produto-id').value;
    const nome = document.getElementById('produto-nome').value;
    const descricao = document.getElementById('produto-descricao').value;
    const preco = parseFloat(document.getElementById('produto-preco').value);
    const previewImg = document.getElementById('preview-imagem-produto');

    const produtoDados = {
        id: id ? parseInt(id) : Date.now(),
        nome,
        descricao,
        preco,
        imagem: previewImg ? previewImg.src : ''
    };

    try {
        if (id) {
            produtosAtuais = produtosAtuais.map(p => p.id === parseInt(id) ? produtoDados : p);
        } else {
            produtosAtuais.push(produtoDados);
        }

        salvarProdutosLocal(produtosAtuais);

        const modalProduto = document.querySelector('modal-produto');
        if(modalProduto && modalProduto.fecharModal) {
            modalProduto.fecharModal();
        }

        renderizarProdutos();
        
    } catch (error) {
        console.error('Erro ao salvar produto:', error);
        alert('Erro ao salvar produto.');
    }
}

function excluirProduto(id) {
    produtosAtuais = produtosAtuais.filter(p => p.id !== id);
    salvarProdutosLocal(produtosAtuais);
    renderizarProdutos();
}

// Executa a carga inicial
carregarDados();

// ----- INTEGRAÇÃO COM PARAMETROS URL -----
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('action') === 'novo-produto') {
    customElements.whenDefined('modal-produto').then(() => {
        setTimeout(() => {
            limparFormulario();
            const modalProduto = document.querySelector('modal-produto');
            if(modalProduto && modalProduto.abrirModal) {
                modalProduto.abrirModal();
            }
            window.history.replaceState({}, document.title, window.location.pathname);
        }, 300);
    });
}