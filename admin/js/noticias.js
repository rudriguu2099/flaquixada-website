import './components/AdminSidebar.js';
import './components/AdminHeader.js';
import './components/ModalNoticia.js';
import { ApiNoticiasService } from '../../js/services/ApiNoticiasService.js'; // Ajuste o caminho se necessário

console.log("Admin Notícias inicializado.");

const btnNovo = document.getElementById('btn-novo-item');
const containerLista = document.getElementById('admin-noticia-list');
let noticiasAtuais = [];

// ----- INICIALIZAÇÃO -----
async function carregarDados() {
    try {
        if (containerLista) {
            containerLista.innerHTML = '<p style="color: #999; padding: 20px;">Carregando notícias...</p>';
        }
        // Busca do banco de dados através do serviço da API
        noticiasAtuais = await ApiNoticiasService.fetchNoticias();
    } catch (error) {
        console.error("Erro ao carregar notícias da API", error);
        noticiasAtuais = [];
    }
    renderizarNoticias();
}

// ----- RENDERIZAÇÃO -----
function renderizarNoticias() {
    if (!containerLista) return;
    containerLista.innerHTML = '';

    if (!noticiasAtuais || noticiasAtuais.length === 0) {
        containerLista.innerHTML = `
            <div style="text-align:center; padding: 40px; color: rgba(255,255,255,0.3);">
                <i class="ri-article-line" style="font-size: 3rem;"></i>
                <p>Nenhuma notícia cadastrada no sistema.</p>
            </div>
        `;
        return;
    }

    const ul = document.createElement('ul');
    ul.className = 'admin-lista-itens';

    noticiasAtuais.forEach(noticia => {
        // Formata a data ISO para o padrão brasileiro (DD/MM/AAAA)
        const dataFormatada = new Date(noticia.data).toLocaleDateString('pt-BR');

        const li = document.createElement('li');
        li.className = 'admin-item';
        li.innerHTML = `
            <div class="item-info">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="item-nome">${noticia.titulo}</span>
                    <span style="font-size: 0.75rem; background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 10px;">${noticia.categoria}</span>
                </div>
                <span class="item-descricao" style="margin-top: 4px;">${noticia.resumo}</span>
                <div class="item-precos" style="margin-top: 8px;">
                    <span style="color: #aaa; font-size: 0.85rem;"><i class="ri-calendar-line"></i> ${dataFormatada}</span>
                </div>
            </div>
            <div class="item-acoes">
                <button class="btn-icon edit" data-id="${noticia._id}" title="Editar"><i class="ri-pencil-line"></i></button>
                <button class="btn-icon delete" data-id="${noticia._id}" title="Excluir"><i class="ri-delete-bin-line"></i></button>
            </div>
        `;
        ul.appendChild(li);
    });

    containerLista.appendChild(ul);
    configurarAcoes();
}

// ----- EVENTOS E AÇÕES DA LISTA -----
function configurarAcoes() {
    document.querySelectorAll('.btn-icon.edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const btnClicado = e.target.closest('.btn-icon');
            const id = btnClicado.dataset.id; // String (_id do Mongo)
            editarNoticia(id);
        });
    });

    document.querySelectorAll('.btn-icon.delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const btnClicado = e.target.closest('.btn-icon');
            const id = btnClicado.dataset.id; // String (_id do Mongo)
            if(confirm("Tem certeza que deseja excluir esta notícia?")) {
                excluirNoticia(id);
            }
        });
    });
}

// ----- ABERTURA DO MODAL -----
if (btnNovo) {
    btnNovo.addEventListener('click', () => {
        limparFormulario();
        const componenteModal = document.querySelector('modal-noticia');
        if(componenteModal && componenteModal.abrirModal) {
            componenteModal.abrirModal();
        }
    });
}

// ----- FORMULÁRIO E CRUD -----
// Usa event delegation no document para garantir que o submit seja pego
// mesmo que o HTML do modal demore para ser baixado
document.addEventListener('submit', (e) => {
    if (e.target && e.target.id === 'form-noticia') {
        salvarNoticia(e);
    }
});

function limparFormulario() {
    const form = document.getElementById('form-noticia');
    if(form) form.reset();
    
    const idInput = document.getElementById('noticia-id');
    if(idInput) idInput.value = '';
    
    const titulo = document.getElementById('modal-titulo');
    if(titulo) titulo.innerText = 'Nova Notícia';

    // Pega a data atual no fuso horário local (Brasil) e não em UTC
    const dataInput = document.getElementById('noticia-data');
    if (dataInput) {
        const d = new Date();
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        const hoje = d.toISOString().split('T')[0];
        
        dataInput.value = hoje;
        dataInput.min = hoje;
    }
}

function editarNoticia(id) {
    const noticia = noticiasAtuais.find(n => n._id === id);
    if (!noticia) return;

    limparFormulario();
    
    // Alimenta os inputs do modal carregado
    document.getElementById('noticia-id').value = noticia._id;
    document.getElementById('noticia-titulo').value = noticia.titulo;
    document.getElementById('noticia-resumo').value = noticia.resumo;
    document.getElementById('noticia-categoria').value = noticia.categoria;
    
    // Converte a data ISO para YYYY-MM-DD para funcionar na tag <input type="date">
    if (noticia.data) {
        const dataInput = document.getElementById('noticia-data');
        if (dataInput) {
            const dataFormatada = noticia.data.split('T')[0];
            dataInput.value = dataFormatada;
            
            // Permite salvar notícias antigas sem erro de validação da data mínima
            const d = new Date();
            d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
            const hoje = d.toISOString().split('T')[0];
            
            dataInput.min = dataFormatada < hoje ? dataFormatada : hoje;
        }
    }
    
    const tituloModal = document.getElementById('modal-titulo');
    if(tituloModal) tituloModal.innerText = 'Editar Notícia';

    const componenteModal = document.querySelector('modal-noticia');
    if(componenteModal && componenteModal.abrirModal) {
        componenteModal.abrirModal();
    }
}

async function salvarNoticia(e) {
    e.preventDefault();
    
    const id = document.getElementById('noticia-id').value;
    const titulo = document.getElementById('noticia-titulo').value;
    const resumo = document.getElementById('noticia-resumo').value;
    const categoria = document.getElementById('noticia-categoria').value;
    const dataInput = document.getElementById('noticia-data').value;

    const payload = {
        titulo,
        resumo,
        categoria,
        // Adiciona 12:00:00 UTC para garantir que, ao converter para o fuso brasileiro, 
        // o dia continue sendo o mesmo (vai cair às 09:00 da manhã do dia correto).
        data: dataInput ? dataInput + 'T12:00:00Z' : new Date().toISOString()
    };

    const btnSubmit = document.querySelector('#form-noticia button[type="submit"]');
    const originalText = btnSubmit ? btnSubmit.innerHTML : 'Salvar';
    if (btnSubmit) { btnSubmit.innerHTML = 'Salvando...'; btnSubmit.disabled = true; }

    try {
        if (id) {
            // Edição via API utilizando o id do banco
            await ApiNoticiasService.atualizarNoticia(id, payload);
        } else {
            // Criação via API
            await ApiNoticiasService.criarNoticia(payload);
        }

        // Fecha o Modal através da instância do Web Component
        const componenteModal = document.querySelector('modal-noticia');
        if(componenteModal && componenteModal.fecharModal) {
            componenteModal.fecharModal();
        }

        // Atualiza a listagem trazendo os dados mais novos do banco
        await carregarDados();
        
    } catch (error) {
        console.error('Erro ao salvar notícia:', error);
        alert(`Erro ao salvar notícia: ${error.message}`);
    } finally {
        if (btnSubmit) { btnSubmit.innerHTML = originalText; btnSubmit.disabled = false; }
    }
}

async function excluirNoticia(id) {
    try {
        await ApiNoticiasService.excluirNoticia(id);
        await carregarDados(); // Recarrega do backend sem vestígios locais
    } catch(error) {
        console.error('Erro ao excluir notícia:', error);
        alert('Erro ao excluir notícia. Verifique as permissões de administrador.');
    }
}

// Executa a carga de dados na montagem da tela
carregarDados();

// ----- INTEGRAÇÃO COM PARAMETROS URL -----
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('action') === 'novo-item') {
    customElements.whenDefined('modal-noticia').then(() => {
        setTimeout(() => {
            limparFormulario();
            const componenteModal = document.querySelector('modal-noticia');
            if(componenteModal && componenteModal.abrirModal) {
                componenteModal.abrirModal();
            }
            window.history.replaceState({}, document.title, window.location.pathname);
        }, 300);
    });
}