class ModalNoticia extends HTMLElement {
    constructor() {
        super();
        this.htmlCarregado = false;
        this.deveAbrirImediatamente = false;
    }

    async connectedCallback() {
        try {
            // Busca o HTML do modal seguindo a sua pasta de componentes HTML
            const response = await fetch('./components_html/modalNoticia.html');
            
            if (!response.ok) {
                throw new Error(`Não foi possível carregar o arquivo HTML. Status: ${response.status}`);
            }

            const pureHtml = await response.text();
            this.innerHTML = pureHtml;

            // Configura os seletores e cliques internos
            this.configurarEventosVisuais();
            this.htmlCarregado = true;

            // Se o usuário clicou no botão "Nova Notícia" antes do fetch terminar, abre agora
            if (this.deveAbrirImediatamente) {
                this.abrirModal();
            }

        } catch (error) {
            console.error('Erro crítico ao carregar modal de notícia:', error);
        }
    }

    configurarEventosVisuais() {
        const btnFechar = this.querySelector('#btn-fechar-modal-noticia');
        const btnCancelar = this.querySelector('#btn-cancelar-noticia');

        // Eventos para fechar
        btnFechar?.addEventListener('click', () => this.fecharModal());
        btnCancelar?.addEventListener('click', () => this.fecharModal());
        
        // Fecha opcionalmente ao clicar no overlay de fundo
        const modal = this.querySelector('#modal-noticia');
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) this.fecharModal();
        });
    }

    abrirModal() {
        const modal = this.querySelector('#modal-noticia');
        
        if (this.htmlCarregado && modal) {
            modal.style.display = 'flex';
            this.deveAbrirImediatamente = false;
        } else {
            // Se o HTML ainda não carregou, avisa o componente para abrir assim que terminar
            this.deveAbrirImediatamente = true;
        }
    }

    fecharModal() {
        const modal = this.querySelector('#modal-noticia');
        if (modal) {
            modal.style.display = 'none';
        }
    }
}

customElements.define('modal-noticia', ModalNoticia);