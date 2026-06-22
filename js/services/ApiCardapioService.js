const API_BASE_URL = 'http://localhost:4000/api';

function getAuthHeaders() {
    const token = localStorage.getItem('adminToken');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
}

export const ApiCardapioService = {
    // Busca todos os itens e agrupa por categoria
    async fetchCardapio() {
        try {
            const response = await fetch(`${API_BASE_URL}/cardapios`);
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status}`);
            }
            
            const result = await response.json();
            const itensBrutos = result.data || [];
            
            // Inicializa a estrutura esperada pelo frontend
            const cardapioAgrupado = {
                bebidas: [],
                petiscos: [],
                pratos: []
            };

            itensBrutos.forEach(item => {
                const itemMapeado = {
                    id: item._id,
                    nome: item.nome,
                    descricao: item.descricao,
                    precoNormal: item.preco_normal,
                    precoSocio: item.preco_socio,
                    categoria: item.categoria
                };

                if (cardapioAgrupado[item.categoria]) {
                    cardapioAgrupado[item.categoria].push(itemMapeado);
                }
            });

            return cardapioAgrupado;
        } catch (error) {
            console.error("Erro ao buscar cardápio da API:", error);
            throw error;
        }
    },

    // Cria um novo item
    async criarItem(dados) {
        const payload = {
            nome: dados.nome,
            descricao: dados.descricao,
            preco_normal: dados.precoNormal,
            preco_socio: dados.precoSocio,
            categoria: dados.categoria
        };

        const response = await fetch(`${API_BASE_URL}/cardapios`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Erro ao criar item');
        }
        return result.data;
    },

    // Atualiza um item
    async atualizarItem(id, dados) {
        const payload = {
            nome: dados.nome,
            descricao: dados.descricao,
            preco_normal: dados.precoNormal,
            preco_socio: dados.precoSocio,
            categoria: dados.categoria
        };

        const response = await fetch(`${API_BASE_URL}/cardapios/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Erro ao atualizar item');
        }
        return result.data;
    },

    // Deleta um item
    async excluirItem(id) {
        const response = await fetch(`${API_BASE_URL}/cardapios/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Erro ao excluir item');
        }
        return result;
    }
};
