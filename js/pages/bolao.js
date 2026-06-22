import { fetchJogos } from '../services/ApiJogosService.js';
import { ApiBolaoService } from '../services/ApiBolaoService.js';
import '../components/navbar.js';
import '../components/Bolao.js';
import '../components/NextGame.js';
import '../components/CardNextGame.js';
import '../components/Footer.js';

window.currentBolaoGameId = null;

async function renderBolaoState(idJogo) {
    const container = document.getElementById('bolao-dynamic-container');
    if (!container) return;

    if (!idJogo) {
        container.innerHTML = `
            <div class="bolao-empty-state">
                <i class="ri-lock-2-line"></i>
                <h2>Bolão Inativo</h2>
                <p>O bolão para essa partida logo mais será aberto, fique de olho!</p>
            </div>
        `;
        return;
    }

    try {
        const painel = await ApiBolaoService.consultarPainel(idJogo);
        if (!painel) {
            throw new Error("Erro ao carregar o painel");
        }

        const { status, slots } = painel;

        if (status === 'INATIVO') {
            container.innerHTML = `
                <div class="bolao-empty-state">
                    <i class="ri-lock-2-line"></i>
                    <h2>Bolão Fechado</h2>
                    <p>O bolão para essa partida ainda não foi aberto, fique de olho!</p>
                </div>
            `;
            return;
        }

        const state = status;

        if (state === 'ABERTO') {
            container.innerHTML = `
                <div class="bolao-participants-list" id="bolao-participants-list"></div>
                
                <div class="bolao-insert-area" id="bolao-insert-area">
                    <p class="bolao-blind-bet-text">Faça sua aposta às cegas:</p>
                    <select id="select-jogador" class="bolao-novo-input bolao-novo-input-margin"></select>
                    <input type="text" id="novo-participante-nome" class="bolao-novo-input" placeholder="Digite seu nome completo">
                    <button id="btn-bolao-salvar" class="btn-bolao btn-bolao-salvar">
                        <i class="ri-check-line"></i> Confirmar Aposta</button>
                </div>
            `;
            renderBolaoList(state, slots);
            
            const btnSalvar = document.getElementById('btn-bolao-salvar');
            if (btnSalvar) btnSalvar.addEventListener('click', salvarAposta);
        } else if (state === 'FECHADO') {
            container.innerHTML = `
                <div class="bolao-revelados-header">
                    <h3><i class="ri-eye-line"></i> Jogadores Revelados!</h3>
                    <p>As apostas estão encerradas. Confira qual o seu jogador!</p>
                </div>
                <div class="bolao-participants-list" id="bolao-participants-list"></div>
            `;
            renderBolaoList(state, slots);
        }
    } catch (error) {
        console.error(error);
        container.innerHTML = `
            <div class="bolao-empty-state">
                <i class="ri-error-warning-line"></i>
                <h2>Erro ao carregar o Bolão</h2>
                <p>Ocorreu um erro ao conectar com o servidor. Tente novamente mais tarde.</p>
            </div>
        `;
    }
}

function renderBolaoList(state, slots) {
    const list = document.getElementById('bolao-participants-list');
    const select = document.getElementById('select-jogador'); 
    if (!list) return;

    list.innerHTML = '';
    if (select) {
        select.innerHTML = '<option value="" disabled selected>Escolha um número disponível...</option>';
    }

    slots.forEach(slot => {
        const row = document.createElement('div');
        row.className = 'bolao-participant-row';
        
        const isTaken = slot.participante && slot.participante.trim().length > 0;
        
        // Se FECHADO, mostra o jogador sorteado. Se ABERTO, esconde (Jogador 1, Jogador 2...)
        const nomeParaMostrar = state === 'FECHADO' 
            ? escapeHTML(slot.jogadorSorteado)
            : `Jogador ${slot.numeroSlot}`;

        row.innerHTML = `
            <div class="bolao-player-info">
                <span class="bolao-player-name">${nomeParaMostrar}</span>
            </div>
            <div class="bolao-participant-info">
                ${isTaken ? `<span class="bolao-participant-name taken"><i class="ri-user-check-fill"></i> ${escapeHTML(slot.participante)}</span>` : `<span class="bolao-participant-name free">Disponível</span>`}
            </div>
        `;
        list.appendChild(row);

        // Se está livre e estamos na fase de apostas, adiciona ao select
        if (!isTaken && select) {
            const option = document.createElement('option');
            option.value = slot.numeroSlot;
            option.textContent = `Jogador ${slot.numeroSlot}`;
            select.appendChild(option);
        }
    });
}

async function salvarAposta() {
    const select = document.getElementById('select-jogador');
    const inputNome = document.getElementById('novo-participante-nome');
    
    if (!select || !inputNome || !window.currentBolaoGameId) return;

    const numeroSlot = parseInt(select.value);
    const participanteNome = inputNome.value.trim();

    if (!numeroSlot) {
        alert('Por favor, selecione uma vaga disponível na lista.');
        return;
    }

    if (!participanteNome) {
        alert('Por favor, digite seu nome completo para confirmar a aposta.');
        return;
    }

    try {
        const btnSalvar = document.getElementById('btn-bolao-salvar');
        if (btnSalvar) btnSalvar.disabled = true;

        await ApiBolaoService.apostarSlot(window.currentBolaoGameId, numeroSlot, participanteNome);
        
        inputNome.value = '';
        await renderBolaoState(window.currentBolaoGameId);
        alert(`Aposta confirmada no Jogador ${numeroSlot}! Boa sorte, o nome real será revelado em breve!`);
    } catch (error) {
        alert(error.message || 'Erro ao realizar a aposta. Tente novamente.');
        await renderBolaoState(window.currentBolaoGameId);
    } finally {
        const btnSalvar = document.getElementById('btn-bolao-salvar');
        if (btnSalvar) btnSalvar.disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const containerPrincipal = document.getElementById('bolao-jogo-atual');
    if (!containerPrincipal) return;

    const loader = document.createElement('div');
    loader.innerHTML = '<p style="text-align: center; color: white;">Carregando jogo...</p>';
    containerPrincipal.appendChild(loader);

    try {
        const jogosDaRodada = await fetchJogos();
        const configGlobal = await ApiBolaoService.obterConfiguracaoGlobais();
        
        containerPrincipal.innerHTML = ''; 

        if (jogosDaRodada.length > 0) {
            let jogosOrdenados = [...jogosDaRodada];

            // Define o id do jogo do bolão baseado na config global ou pega o próximo
            if (configGlobal && configGlobal.idJogoAtivo) {
                window.currentBolaoGameId = configGlobal.idJogoAtivo;
                const targetGameId = Number(configGlobal.idJogoAtivo);
                const gameIndex = jogosOrdenados.findIndex(j => j.id === targetGameId);
                
                if (gameIndex > -1) {
                    const selectedGame = jogosOrdenados.splice(gameIndex, 1)[0];
                    jogosOrdenados.unshift(selectedGame); // Coloca na primeira posição
                }
            } else {
                window.currentBolaoGameId = jogosOrdenados[0].id;
            }

            const cardDestaque = new CardNextGame(jogosOrdenados);
            cardDestaque.setAttribute('custom-title', 'Faça sua aposta');
            cardDestaque.setAttribute('custom-icon', 'ri-trophy-line');
            containerPrincipal.appendChild(cardDestaque);
            
            // Renderiza o painel do bolão para o jogo atual
            renderBolaoState(window.currentBolaoGameId);
        } else {
            containerPrincipal.innerHTML = '<p style="text-align: center; color: white;">Nenhum jogo disponível no momento.</p>';
            renderBolaoState(null);
        }
    } catch (error) {
        containerPrincipal.innerHTML = '<p style="text-align: center; color: white;">Erro ao carregar o jogo.</p>';
        console.error("Erro inicialização do bolão:", error);
    }
});

function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[&<>'"]/g, function(tag) {
        const charsToReplace = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        };
        return charsToReplace[tag] || tag;
    });
}