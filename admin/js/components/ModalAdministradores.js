export default class ModalAdministradores extends HTMLElement {
    async connectedCallback() {
        try {
            const resposta = await fetch('./components_html/modalAdministradores.html');
            const htmlPuro = await resposta.text();
            
            setTimeout(() => {
                this.innerHTML = htmlPuro;
                this.registrarEventos();
            }, 50);
            
        } catch (erro) {
            console.error("Erro ao carregar o Modal de Administradores:", erro);
        }
    }

    registrarEventos() {
        const btnFechar = this.querySelector('#btn-fechar-modal-admin');
        const btnCancelar = this.querySelector('#btn-cancelar-admin');
        const formAdmin = this.querySelector('#form-admin');

        if(btnFechar) btnFechar.addEventListener('click', (e) => { e.preventDefault(); this.fecharModal(); });
        if(btnCancelar) btnCancelar.addEventListener('click', (e) => { e.preventDefault(); this.fecharModal(); });

        if(formAdmin) {
            formAdmin.addEventListener('submit', (e) => {
                e.preventDefault();
                this.salvarAdmin();
            });
        }
    }

    abrirModal(admin = null) {
        const modal = this.querySelector('#modal-admin');
        const titulo = this.querySelector('#modal-admin-title');
        const form = this.querySelector('#form-admin');
        const grupoSenha = this.querySelector('#grupo-senha');
        const inputSenha = this.querySelector('#admin-senha');
        
        if (!modal) return; // Segurança

        form.reset();

        if (admin) {
            titulo.textContent = 'Editar Administrador';
            this.querySelector('#admin-id').value = admin.id;
            this.querySelector('#admin-nome').value = admin.nome;
            this.querySelector('#admin-email').value = admin.email;
            
            // Esconde e remove a obrigatoriedade da senha na edição
            grupoSenha.style.display = 'none';
            inputSenha.removeAttribute('required');
        } else {
            titulo.textContent = 'Novo Administrador';
            this.querySelector('#admin-id').value = '';
            
            grupoSenha.style.display = 'flex';
            inputSenha.setAttribute('required', 'true');
        }

        modal.style.display = 'flex';
    }

    fecharModal() {
        const modal = this.querySelector('#modal-admin');
        if(modal) modal.style.display = 'none';
    }

    salvarAdmin() {
        const id = this.querySelector('#admin-id').value;
        const nome = this.querySelector('#admin-nome').value;
        const email = this.querySelector('#admin-email').value;
        const senha = this.querySelector('#admin-senha').value;

        const dadosAdmin = {
            id: id || Date.now().toString(),
            nome,
            email
        };
        
        if (senha) {
            dadosAdmin.senha = senha;
        }

        this.dispatchEvent(new CustomEvent('salvar-admin', {
            detail: dadosAdmin,
            bubbles: true
        }));

        this.fecharModal();
    }
}

customElements.define('modal-administradores', ModalAdministradores);
