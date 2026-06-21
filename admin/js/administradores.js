// Módulos globais do painel
import './components/AdminSidebar.js';
import './components/AdminHeader.js';
import './components/ModalAdministradores.js';

let adminsAtual = [];
const containerLista = document.getElementById('admin-list-container');
const btnNovoAdmin = document.getElementById('btn-novo-admin');
let modalComponent = null;

const API_URL = 'http://localhost:4000/api/usuarios';

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        modalComponent = document.querySelector('modal-administradores');
        inicializarEventosGlobais();
        carregarDados();
    }, 100);
});

async function carregarDados() {
    try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok && data.success) {
            const loggedUserStr = localStorage.getItem('adminUser');
            let loggedUserId = null;
            if (loggedUserStr) {
                try {
                    loggedUserId = JSON.parse(loggedUserStr).id;
                } catch(e) {}
            }

            // A API retorna um array em data.data
            adminsAtual = data.data
                .filter(user => user._id !== loggedUserId)
                .map(user => ({
                    id: user._id,
                    nome: user.nome,
                    email: user.email,
                    role: user.role
                }));
            renderizarAdmins();
        } else {
            console.error('Erro ao buscar administradores:', data.error);
            alert('Não foi possível carregar a lista de administradores.');
        }
    } catch (error) {
        console.error('Erro de conexão ao buscar administradores:', error);
        alert('Erro de conexão com o backend. O servidor está rodando?');
    }
}

function inicializarEventosGlobais() {
    if (btnNovoAdmin && modalComponent) {
        btnNovoAdmin.addEventListener('click', () => {
            modalComponent.abrirModal();
        });
    }

    if (modalComponent) {
        modalComponent.addEventListener('salvar-admin', (e) => {
            const dados = e.detail;
            salvarAdministrador(dados);
        });
    }
}

function renderizarAdmins() {
    if (!containerLista) return;
    containerLista.innerHTML = '';

    if (adminsAtual.length === 0) {
        containerLista.innerHTML = '<p style="color: rgba(255,255,255,0.6); text-align: center; padding: 20px;">Nenhum administrador cadastrado.</p>';
        return;
    }

    adminsAtual.forEach(admin => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'admin-card-item';
        
        itemDiv.innerHTML = `
            <div class="admin-info">
                <div class="admin-avatar">
                    <i class="ri-user-fill"></i>
                </div>
                <div class="admin-details">
                    <span class="admin-name">${admin.nome}</span>
                    <span class="admin-email">${admin.email}</span>
                </div>
            </div>
            <div class="admin-actions">
                <button class="btn-icon edit" title="Editar"><i class="ri-pencil-line"></i></button>
                <button class="btn-icon delete" title="Excluir"><i class="ri-delete-bin-line"></i></button>
            </div>
        `;

        // Eventos
        const btnEdit = itemDiv.querySelector('.edit');
        const btnDelete = itemDiv.querySelector('.delete');

        btnEdit.addEventListener('click', () => {
            if (modalComponent) modalComponent.abrirModal(admin);
        });

        btnDelete.addEventListener('click', () => {
            if (confirm(`Tem certeza que deseja excluir o administrador(a) ${admin.nome}?`)) {
                excluirAdmin(admin.id);
            }
        });

        containerLista.appendChild(itemDiv);
    });
}

async function salvarAdministrador(dadosNovos) {
    const isEdit = adminsAtual.some(a => a.id === dadosNovos.id);
    const token = localStorage.getItem('adminToken');

    const payload = {
        nome: dadosNovos.nome,
        email: dadosNovos.email,
        role: 'admin' // Definindo o nível padrão, o backend também valida
    };

    if (dadosNovos.senha) {
        payload.password = dadosNovos.senha;
    }
    
    try {
        let url = API_URL;
        let method = 'POST';

        if (isEdit) {
            url = `${API_URL}/${dadosNovos.id}`;
            method = 'PUT';
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok && data.success) {
            alert(isEdit ? 'Administrador atualizado com sucesso!' : 'Administrador cadastrado com sucesso!');
            // Recarrega os dados do backend para atualizar a lista
            await carregarDados();
        } else {
            let errorMsg = data.error || 'Erro ao salvar administrador.';
            if (data.detalhes) {
                const mensagens = Object.values(data.detalhes).flat().join('\n');
                errorMsg += '\n' + mensagens;
            }
            alert(errorMsg);
        }
    } catch (error) {
        console.error('Erro de conexão ao salvar administrador:', error);
        alert('Erro de conexão com o backend. O servidor está rodando?');
    }
}

async function excluirAdmin(id) {
    // Evita excluir visualmente antes de confirmar
    if (adminsAtual.length <= 1) {
        alert("Atenção: Não é possível excluir o único administrador do sistema.");
        return;
    }
    
    try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok && data.success) {
            alert('Administrador excluído com sucesso!');
            await carregarDados();
        } else {
            alert(data.error || 'Erro ao excluir administrador.');
        }
    } catch (error) {
        console.error('Erro de conexão ao excluir administrador:', error);
        alert('Erro de conexão com o backend.');
    }
}
