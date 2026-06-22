const API_BASE_URL = 'http://localhost:4000/api';

function getHeaders(auth = false) {
    const headers = {
        'Content-Type': 'application/json'
    };
    if (auth) {
        const token = localStorage.getItem('adminToken');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }
    return headers;
}

export const ApiBolaoService = {
    // Rotas Públicas
    async obterConfiguracaoGlobais() {
        try {
            const response = await fetch(`${API_BASE_URL}/bolao/config?t=${Date.now()}`, {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            if (!response.ok) throw new Error('Erro ao buscar configuração global');
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    async consultarPainel(idJogo) {
        try {
            const response = await fetch(`${API_BASE_URL}/bolao/painel/${idJogo}?t=${Date.now()}`, {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            if (!response.ok) throw new Error('Erro ao carregar painel');
            const data = await response.json();
            return data.data; // { idJogo, jaSorteado, slots }
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    async apostarSlot(idJogo, numeroSlot, participanteNome) {
        try {
            const response = await fetch(`${API_BASE_URL}/bolao/apostar`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ idJogo: String(idJogo), numeroSlot, participanteNome })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erro ao apostar');
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    // Rotas Privadas (Admin)
    async salvarConfiguracaoGlobais(idJogoAtivo) {
        try {
            const response = await fetch(`${API_BASE_URL}/bolao/config`, {
                method: 'PUT',
                headers: getHeaders(true),
                body: JSON.stringify({ idJogoAtivo })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erro ao salvar configuração global');
            return data.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async realizarSorteio(idJogo) {
        try {
            const response = await fetch(`${API_BASE_URL}/bolao/sorteio/${idJogo}`, {
                method: 'GET',
                headers: getHeaders(true)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erro ao realizar sorteio');
            return data.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async alterarStatusManual(idJogo, status) {
        try {
            const response = await fetch(`${API_BASE_URL}/bolao/${idJogo}/status`, {
                method: 'PUT',
                headers: getHeaders(true),
                body: JSON.stringify({ status })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erro ao alterar status');
            return data.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async salvarJogadoresManuais(idJogo, jogadores) {
        try {
            const response = await fetch(`${API_BASE_URL}/bolao/${idJogo}/jogadores`, {
                method: 'PUT',
                headers: getHeaders(true),
                body: JSON.stringify({ jogadores })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erro ao salvar jogadores');
            return data.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async deletarAposta(idJogo, numeroSlot) {
        try {
            const response = await fetch(`${API_BASE_URL}/bolao/${idJogo}/slot/${numeroSlot}`, {
                method: 'DELETE',
                headers: getHeaders(true)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erro ao deletar aposta');
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async alterarSlot(idJogo, numeroSlotAtual, novoNumeroSlot) {
        try {
            const response = await fetch(`${API_BASE_URL}/bolao/${idJogo}/alterar-slot`, {
                method: 'PATCH',
                headers: getHeaders(true),
                body: JSON.stringify({ numeroSlotAtual, novoNumeroSlot })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erro ao alterar slot');
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async alterarNomeParticipante(idJogo, numeroSlot, nome) {
        try {
            const response = await fetch(`${API_BASE_URL}/bolao/${idJogo}/slot/${numeroSlot}/nome`, {
                method: 'PATCH',
                headers: getHeaders(true),
                body: JSON.stringify({ nome })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erro ao alterar nome');
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async alternarPagamento(idJogo, numeroSlot) {
        try {
            const response = await fetch(`${API_BASE_URL}/bolao/${idJogo}/slot/${numeroSlot}/pagamento`, {
                method: 'PATCH',
                headers: getHeaders(true)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erro ao alternar pagamento');
            return data.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async limparJogo(idJogo) {
        try {
            const response = await fetch(`${API_BASE_URL}/bolao/reset/${idJogo}`, {
                method: 'DELETE',
                headers: getHeaders(true)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erro ao limpar jogo');
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
