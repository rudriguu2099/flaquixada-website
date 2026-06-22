class ModalCardapio extends HTMLElement {
    async connectedCallback() {
        try {
            const response = await fetch('./components_html/modalCardapio.html');
            const pureHtml = await response.text();

            this.innerHTML = pureHtml;

            this.configurarEventosVisuais();
        } catch (error) {
            console.error('Erro ao carregar o HTML do modal cardápio:', error);
        }
    }

    configurarEventosVisuais() {
        const modal = this.querySelector('#modal-cardapio');
        const btnFechar = this.querySelector('#btn-fechar-modal');
        const btnCancelar = this.querySelector('#btn-cancelar');

        if (btnFechar) {
            btnFechar.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        if (btnCancelar) {
            btnCancelar.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
    }

    abrirModal() {
        const modal = this.querySelector('#modal-cardapio');
        if(modal) {
            modal.style.display = 'flex';
        }
    }
}

customElements.define('modal-cardapio', ModalCardapio);
