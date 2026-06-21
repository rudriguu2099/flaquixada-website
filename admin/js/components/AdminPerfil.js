export default class AdminPerfil extends HTMLElement {
    async connectedCallback() {
        try {
            const resposta = await fetch('./components_html/adminPerfil.html');
            const htmlPuro = await resposta.text();
            
            this.innerHTML = htmlPuro;
            
            this.carregarDadosPerfil();
            this.inicializarEventos();
            
        } catch (erro) {
            console.error("Erro ao carregar o HTML do perfil:", erro);
        }
    }

    carregarDadosPerfil() {
        try {
            const userStr = localStorage.getItem('adminUser');
            if (!userStr) return; 

            const user = JSON.parse(userStr);
            const cargoElement = this.querySelector('#perfil-cargo');
            const nomeElement = this.querySelector('#perfil-nome');
            const emailElement = this.querySelector('#perfil-email');

            if (nomeElement) nomeElement.value = user.name || "Higor Silva";
            if (emailElement) emailElement.value = user.email || "consulado@gmail.com";

            if (cargoElement) {
                cargoElement.textContent = user.role === 'super-admin' ? 'Super Administrador' : 'Administrador';
            }
        } catch (e) {
            console.error("Erro ao processar dados do perfil local.", e);
        }
    }

    inicializarEventos() {
        const btnAlterarSenha = this.querySelector('#btn-alterar-senha');
        const botoesEditar = this.querySelectorAll('.btn-icon-perfil');

        botoesEditar.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const container = e.currentTarget.closest('.input-with-icon');
                const input = container.querySelector('input');
                const icon = e.currentTarget.querySelector('i');

                if (input.disabled) {
                    // Ativar Edição
                    input.disabled = false;
                    input.classList.remove('disabled-input');
                    input.focus();
                    icon.className = 'ri-check-line';
                    
                    e.currentTarget.style.backgroundColor = 'var(--red-fla, #E11A22)'; 
                    e.currentTarget.style.borderColor = 'var(--red-fla, #E11A22)';
                    e.currentTarget.title = 'Salvar';
                } else {
                    // "Salvar" no LocalStorage
                    input.disabled = true;
                    input.classList.add('disabled-input');
                    icon.className = 'ri-pencil-line';
                    e.currentTarget.style.backgroundColor = ''; 
                    e.currentTarget.style.borderColor = ''; 
                    e.currentTarget.title = 'Editar';

                    try {
                        const userStr = localStorage.getItem('adminUser');
                        if (userStr) {
                            const user = JSON.parse(userStr);
                            if (input.id === 'perfil-nome') user.name = input.value;
                            if (input.id === 'perfil-email') user.email = input.value;
                            localStorage.setItem('adminUser', JSON.stringify(user));
                        }
                    } catch(err) {
                        console.error("Erro ao salvar perfil no localStorage", err);
                    }
                }
            });
        });
        
        if (btnAlterarSenha) {
            btnAlterarSenha.addEventListener('click', () => {
                const modalPerfilComponent = document.querySelector('modal-perfil');
                if (modalPerfilComponent) {
                    modalPerfilComponent.abrirModal();
                }
            });
        }
    }
}

customElements.define('admin-perfil', AdminPerfil);
