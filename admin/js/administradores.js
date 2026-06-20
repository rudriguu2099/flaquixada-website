// Módulos globais do painel
import './components/AdminSidebar.js';
import './components/AdminHeader.js';
import './components/ModalAdministradores.js';

import { obterAdminsLocal, salvarAdminsLocal } from '../../js/utils/mockAdministradores.js';

let adminsAtual = [];
const containerLista = document.getElementById('admin-list-container');
const btnNovoAdmin = document.getElementById('btn-novo-admin');
let modalComponent = null;

document.addEventListener('DOMContentLoaded', () => {

    setTimeout(() => {
        modalComponent = document.querySelector('modal-administradores');
        inicializarEventosGlobais();
        carregarDados();
    }, 100);
});

function carregarDados() {
    adminsAtual = obterAdminsLocal();
    renderizarAdmins();
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

function salvarAdministrador(dadosNovos) {
    const index = adminsAtual.findIndex(a => a.id === dadosNovos.id);
    
    if (index !== -1) {
        // Editando existente
        // Se a senha veio vazia, mantemos a senha antiga
        if (!dadosNovos.senha) {
            dadosNovos.senha = adminsAtual[index].senha;
        }
        adminsAtual[index] = { ...adminsAtual[index], ...dadosNovos };
    } else {
        // Criando novo
        adminsAtual.push(dadosNovos);
    }
    
    salvarAdminsLocal(adminsAtual);
    renderizarAdmins();
}

function excluirAdmin(id) {
    // Evita excluir o único administrador
    if (adminsAtual.length <= 1) {
        alert("Atenção: Não é possível excluir o único administrador do sistema.");
        return;
    }
    
    adminsAtual = adminsAtual.filter(a => a.id !== id);
    salvarAdminsLocal(adminsAtual);
    renderizarAdmins();
}
