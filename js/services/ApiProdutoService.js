const API_BASE_URL = 'http://localhost:4000/api';

function getAuthHeaders() {
    const token = localStorage.getItem('adminToken');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
}

export const ApiProdutoService = {
    /**
     * Lista todos os produtos cadastrados.
     * A resposta NÃO inclui a foto (binário) — use getUrlFoto() para exibir as imagens.
     */
    async fetchProdutos() {
        const response = await fetch(`${API_BASE_URL}/produtos`);
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Erro ao buscar produtos');
        }
        return result.data || [];
    },

    /**
     * Retorna a URL da imagem de um produto para uso em src de <img>.
     * Ex: <img src="${ApiProdutoService.getUrlFoto(produto._id)}">
     */
    getUrlFoto(id) {
        return `${API_BASE_URL}/produtos/${id}/foto`;
    },

    /**
     * Cria um novo produto.
     * @param {Object} dados - { nome, preco, descricao, fotoBase64 }
     * fotoBase64 deve ser uma string no formato "data:image/jpeg;base64,..."
     */
    async criarProduto(dados) {
        const response = await fetch(`${API_BASE_URL}/produtos`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(dados)
        });

        const result = await response.json();
        if (!response.ok) {
            let msg = result.error || 'Erro ao criar produto';
            if (result.detalhes) {
                msg += '\n' + Object.values(result.detalhes).flat().join('\n');
            }
            throw new Error(msg);
        }
        return result.data;
    },

    /**
     * Edita um produto existente.
     * @param {string} id - _id do MongoDB
     * @param {Object} dados - { nome?, preco?, descricao?, fotoBase64? }
     * fotoBase64 é opcional — se não enviado, a foto atual é mantida.
     */
    async editarProduto(id, dados) {
        const response = await fetch(`${API_BASE_URL}/produtos/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(dados)
        });

        const result = await response.json();
        if (!response.ok) {
            let msg = result.error || 'Erro ao editar produto';
            if (result.detalhes) {
                msg += '\n' + Object.values(result.detalhes).flat().join('\n');
            }
            throw new Error(msg);
        }
        return result.data;
    },

    /**
     * Remove um produto pelo _id do MongoDB.
     * @param {string} id - _id do MongoDB
     */
    async excluirProduto(id) {
        const response = await fetch(`${API_BASE_URL}/produtos/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Erro ao excluir produto');
        }
        return result;
    }
};
