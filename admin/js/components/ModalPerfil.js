export default class ModalPerfil extends HTMLElement {
    async connectedCallback() {
        try {
            const resposta = await fetch('./components_html/modalPerfil.html');
            const htmlPuro = await resposta.text();
            
            setTimeout(() => {
                this.innerHTML = htmlPuro;
                this.registrarEventos();
            }, 50);
            
        } catch (erro) {
            console.error("Erro ao carregar o Modal do Perfil:", erro);
        }
    }

    registrarEventos() {
        const btnFechar = this.querySelector('#btn-fechar-modal-senha');
        const btnCancelar = this.querySelector('#btn-cancelar-senha');
        const formSenha = this.querySelector('#form-alterar-senha');

        if(btnFechar) btnFechar.addEventListener('click', (e) => { e.preventDefault(); this.fecharModal(); });
        if(btnCancelar) btnCancelar.addEventListener('click', (e) => { e.preventDefault(); this.fecharModal(); });

        if(formSenha) {
            formSenha.addEventListener('submit', (e) => {
                e.preventDefault();
                this.salvarSenha();
            });
        }
    }

    abrirModal() {
        const modal = this.querySelector('#modal-senha');
        const form = this.querySelector('#form-alterar-senha');
        
        if (!modal) return;

        form.reset();
        modal.style.display = 'flex';
    }

    fecharModal() {
        const modal = this.querySelector('#modal-senha');
        if(modal) modal.style.display = 'none';
    }

    salvarSenha() {
        const senhaAtual = this.querySelector('#senha-atual').value;
        const novaSenha = this.querySelector('#nova-senha').value;
        const confirmarSenha = this.querySelector('#confirmar-senha').value;

        if (novaSenha.length < 8) {
            alert("A nova senha deve conter no mínimo 8 caracteres.");
            return;
        }

        if (novaSenha !== confirmarSenha) {
            alert("As senhas não coincidem. A confirmação deve ser igual à nova senha.");
            return;
        }

        // Dispara evento para a página lidar com a lógica de salvar
        this.dispatchEvent(new CustomEvent('salvar-senha-perfil', {
            detail: {
                senhaAtual,
                novaSenha
            },
            bubbles: true
        }));
    }
}

customElements.define('modal-perfil', ModalPerfil);
