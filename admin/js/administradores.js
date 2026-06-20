// Módulos globais do painel
import './components/AdminSidebar.js';
import './components/AdminHeader.js';
import './components/ModalAdministradores.js';

console.log("Interface de Gerenciamento de Administradores carregada com sucesso.");

// Como os componentes Web são carregados de forma assíncrona, aguardamos um breve momento
setTimeout(() => {
    inicializarEventosInterface();
}, 100);

function inicializarEventosInterface() {
    const btnNovoAdmin = document.getElementById('btn-novo-admin');
    const modalComponent = document.querySelector('modal-administradores');

    if (!modalComponent) {
        console.error("Componente <modal-administradores> não encontrado no DOM.");
        return;
    }

    // Evento de abrir o modal vazio para criação
    if (btnNovoAdmin) {
        btnNovoAdmin.addEventListener('click', () => {
            modalComponent.abrirModal();
        });
    }

    // Evento de abrir o modal preenchido para edição (usando a lista estática atual)
    const botoesEditar = document.querySelectorAll('.btn-icon.edit');
    botoesEditar.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Pega o card pai para extrair o nome e email do HTML
            const card = e.target.closest('.admin-card-item');
            if (card) {
                const nome = card.querySelector('.admin-name').textContent;
                const email = card.querySelector('.admin-email').textContent;
                
                modalComponent.abrirModal({
                    id: '1', // ID Fictício
                    nome: nome,
                    email: email
                });
            }
        });
    });

    // Escuta o evento Customizado disparado pelo Modal ao enviar o Formulário
    modalComponent.addEventListener('salvar-admin', (e) => {
        const dados = e.detail;
        console.log("Interface capturou os dados a serem salvos:", dados);
        alert(`Formulário enviado!\nNome: ${dados.nome}\nE-mail: ${dados.email}\n`);
    });
}
