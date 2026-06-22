class ModalProduto extends HTMLElement {
    constructor() {
        super();
        this.htmlCarregado = false;
        this.deveAbrirImediatamente = false;
        this._base64Atual = null;     // Armazena o Base64 da imagem selecionada
        this._modoEdicao = false;     // true = editando produto existente
    }

    async connectedCallback() {
        try {
            const response = await fetch('./components_html/modalProduto.html');
            if (!response.ok) {
                throw new Error(`Não foi possível carregar o arquivo HTML. Status: ${response.status}`);
            }

            const pureHtml = await response.text();
            this.innerHTML = pureHtml;

            this.configurarEventosVisuais();
            this.htmlCarregado = true;

            if (this.deveAbrirImediatamente) {
                this.abrirModal(this._produtoPendente || null);
            }

        } catch (error) {
            console.error('Erro crítico ao carregar modal de produto:', error);
        }
    }

    configurarEventosVisuais() {
        const btnFechar = this.querySelector('#btn-fechar-modal-produto');
        const btnCancelar = this.querySelector('#btn-cancelar-produto');
        const inputImagem = this.querySelector('#produto-imagem');
        const preview = this.querySelector('#preview-imagem-produto');
        const modal = this.querySelector('#modal-produto');

        // ----- PREVIEW + CONVERSÃO PARA BASE64 -----
        inputImagem?.addEventListener('change', (e) => {
            const arquivo = e.target.files[0];
            if (!arquivo) return;

            const MAX_FILE_SIZE = 5242880;
            if (arquivo.size > MAX_FILE_SIZE) {
                alert('A imagem selecionada é muito grande. O tamanho máximo permitido é de 5MB.');
                e.target.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target.result; // "data:image/jpeg;base64,..."
                this._base64Atual = base64;
                if (preview) preview.src = base64;
            };
            reader.readAsDataURL(arquivo);
        });

        // ----- FECHAR -----
        btnFechar?.addEventListener('click', () => this.fecharModal());
        btnCancelar?.addEventListener('click', () => this.fecharModal());

        // Fecha ao clicar no overlay de fundo
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) this.fecharModal();
        });
    }

    /**
     * Abre o modal.
     * @param {Object|null} produto - Se null, abre em modo criação.
     *                                Se passado, abre em modo edição.
     */
    abrirModal(produto = null) {
        if (!this.htmlCarregado) {
            this.deveAbrirImediatamente = true;
            this._produtoPendente = produto;
            return;
        }

        const modal = this.querySelector('#modal-produto');
        const inputImagem = this.querySelector('#produto-imagem');
        if (!modal) return;

        // Reseta o Base64 ao abrir — será preenchido quando o usuário escolher nova foto
        this._base64Atual = null;
        this._modoEdicao = !!produto;

        // No modo edição, o campo de imagem NÃO é obrigatório
        // (a foto atual já está salva no banco)
        if (inputImagem) {
            if (this._modoEdicao) {
                inputImagem.removeAttribute('required');
            } else {
                inputImagem.setAttribute('required', 'true');
            }
        }

        modal.style.display = 'flex';
        this.deveAbrirImediatamente = false;
    }

    fecharModal() {
        const modal = this.querySelector('#modal-produto');
        if (modal) {
            modal.style.display = 'none';
            this._base64Atual = null;
        }
    }

    /**
     * Retorna o Base64 da imagem atualmente selecionada pelo usuário.
     * Retorna null se nenhuma imagem nova foi selecionada.
     */
    getBase64Atual() {
        return this._base64Atual;
    }
}

customElements.define('modal-produto', ModalProduto);