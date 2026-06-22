const API_BASE_URL = 'http://localhost:4000/api';

function getAuthHeaders() {
    const token = localStorage.getItem('adminToken');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
}

export const ApiNoticiasService = {
    // Busca todas as notícias cadastradas
    async fetchNoticias() {
        try {
            const response = await fetch(`${API_BASE_URL}/noticias`);
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status}`);
            }
            
            const result = await response.json();
            // Retorna o array bruto vindo do campo 'data' do seu JSON
            return result.data || [];
        } catch (error) {
            console.error("Erro ao buscar notícias da API:", error);
            throw error;
        }
    },

    // Cria uma nova notícia
    async criarNoticia(dados) {
        const payload = {
            titulo: dados.titulo,
            resumo: dados.resumo,
            categoria: dados.categoria,
            data: dados.data
        };

        const response = await fetch(`${API_BASE_URL}/noticias`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Erro ao criar notícia');
        }
        return result.data;
    },

    // Atualiza uma notícia existente pelo _id
    async atualizarNoticia(id, dados) {
        const payload = {
            titulo: dados.titulo,
            resumo: dados.resumo,
            categoria: dados.categoria,
            data: dados.data
        };

        const response = await fetch(`${API_BASE_URL}/noticias/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Erro ao atualizar notícia');
        }
        return result.data;
    },

    // Deleta uma notícia pelo _id
    async excluirNoticia(id) {
        const response = await fetch(`${API_BASE_URL}/noticias/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Erro ao excluir notícia');
        }
        return result;
    }
};