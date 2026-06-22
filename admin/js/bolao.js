// Módulos globais do painel
import './components/AdminSidebar.js';
import './components/AdminHeader.js';
import { fetchJogos } from '../../js/services/ApiJogosService.js';
import { ApiBolaoService } from '../../js/services/ApiBolaoService.js';
import '../../js/components/NextGame.js';
import '../../js/components/CardNextGame.js';

let currentState = 'INATIVO';
let loadedJogos = [];
let currentAdminGameId = null;

document.addEventListener('DOMContentLoaded', () => {
    inicializarToggleJogadores();
    inicializarTogglePagamentos();

    const btnSalvar = document.getElementById('btn-salvar-jogadores');
    if (btnSalvar) {
        btnSalvar.addEventListener('click', salvarJogadores);
    }

    const btnZerar = document.getElementById('btn-zerar-apostas');
    if (btnZerar) {
        btnZerar.addEventListener('click', zerarApostas);
    }

    const btnEmbaralhar = document.getElementById('btn-embaralhar-jogadores');
    if (btnEmbaralhar) {
        btnEmbaralhar.addEventListener('click', embaralharJogadoresInputs);
    }

    const btnSorteioCartola = document.getElementById('btn-sorteio-cartola');
    if (btnSorteioCartola) {
        btnSorteioCartola.addEventListener('click', buscarSorteioCartola);
    }

    inicializarSelecaoJogo();

    const btnsState = document.querySelectorAll('.btn-state');
    btnsState.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const newState = e.currentTarget.getAttribute('data-state');
            mudarEstadoBolaoAPI(newState);
        });
    });
});

function inicializarToggleJogadores() {
    const btnToggle = document.getElementById('btn-toggle-jogadores');
    const content = document.getElementById('content-jogadores');

    if (btnToggle && content) {
        btnToggle.addEventListener('click', () => {
            btnToggle.classList.toggle('active');
            if (content.style.display === 'none' || content.style.display === '') {
                content.style.display = 'block';
            } else {
                content.style.display = 'none';
            }
        });
    }
}

function inicializarTogglePagamentos() {
    const btnToggle = document.getElementById('btn-toggle-pagamentos');
    const content = document.getElementById('content-pagamentos');

    if (btnToggle && content) {
        btnToggle.addEventListener('click', () => {
            btnToggle.classList.toggle('active');
            if (content.style.display === 'none' || content.style.display === '') {
                content.style.display = 'block';
            } else {
                content.style.display = 'none';
            }
        });
    }
}

async function mudarEstadoBolaoAPI(newState) {
    if (!currentAdminGameId) {
        alert("Selecione um jogo primeiro!");
        return;
    }
    if (currentState === newState) return;
    
    try {
        await ApiBolaoService.alterarStatusManual(currentAdminGameId, newState);
        currentState = newState;
        atualizarUIEstado();
        
        if (newState === 'INATIVO') {
            carregarEstadoBolao(currentAdminGameId);
        }
        
        alert(`Estado do bolão alterado para: ${newState}`);
    } catch (error) {
        alert(error.message || "Erro ao mudar status.");
    }
}

function atualizarUIEstado() {
    const lblEstado = document.getElementById('lbl-estado-atual');
    const lblDesc = document.getElementById('lbl-estado-desc');
    
    if (!lblEstado || !lblDesc) return;

    lblEstado.className = 'badge-estado';
    
    const btnsState = document.querySelectorAll('.btn-state');
    btnsState.forEach(btn => btn.classList.remove('active'));

    const btnAtivo = document.querySelector(`.btn-state[data-state="${currentState}"]`);
    if (btnAtivo) btnAtivo.classList.add('active');

    if (currentState === 'INATIVO') {
        lblEstado.textContent = 'INATIVO';
        lblEstado.classList.add('inativo');
        lblDesc.textContent = 'O bolão está fechado e aguardando configuração.';
    } else if (currentState === 'ABERTO') {
        lblEstado.textContent = 'ABERTO (Apostas)';
        lblEstado.classList.add('aberto');
        lblDesc.textContent = 'O bolão está liberado! Usuários podem escolher seus números às cegas.';
    } else if (currentState === 'FECHADO') {
        lblEstado.textContent = 'FECHADO (Revelado)';
        lblEstado.classList.add('fechado');
        lblDesc.textContent = 'Apostas encerradas! Os nomes dos jogadores foram revelados para o público.';
    }
}

async function carregarEstadoBolao(idJogo) {
    if (!idJogo) return;
    try {
        const painel = await ApiBolaoService.consultarPainel(idJogo);
        if (!painel) throw new Error("Erro ao consultar painel");
        
        currentState = painel.status || 'INATIVO';
        atualizarUIEstado();
        
        renderizarInputsJogadores(painel.jogadores || []);
        renderizarPagamentos(painel.slots || []);
    } catch (error) {
        console.error(error);
        alert("Erro ao carregar estado do bolão.");
    }
}

function renderizarInputsJogadores(jogadores = []) {
    const container = document.getElementById('bolao-jogadores-container');
    if (!container) return;

    container.innerHTML = '';

    for (let i = 0; i < 10; i++) {
        const row = document.createElement('div');
        row.className = 'bolao-jogador-row';
        
        const jogadorVal = (jogadores[i] && jogadores[i].nomeJogador) ? escapeHTML(jogadores[i].nomeJogador) : '';

        row.innerHTML = `
            <div class="bolao-jogador-number">${i + 1}</div>
            <div class="bolao-jogador-input-group" style="width: 100%;">
                <label>Jogador ${i + 1}</label>
                <input type="text" class="input-jogador" id="jogador-input-${i+1}" placeholder="Nome do Atleta ${i+1}" value="${jogadorVal}">
            </div>
        `;
        
        container.appendChild(row);
    }
}

async function salvarJogadores(eventoOuSilent = false) {
    const silent = typeof eventoOuSilent === 'boolean' ? eventoOuSilent : false;

    if (!currentAdminGameId) {
        if (!silent) alert("Selecione um jogo primeiro!");
        return;
    }

    const jogadores = [];
    for(let i = 1; i <= 10; i++) {
        const input = document.getElementById(`jogador-input-${i}`);
        const nomeInformado = input ? input.value.trim() : '';
        jogadores.push({
            id: i,
            nomeJogador: nomeInformado
        });
    }

    try {
        await ApiBolaoService.salvarJogadoresManuais(currentAdminGameId, jogadores);
        if (!silent) alert("Lista de jogadores salva com sucesso! O bolão pode ser aberto.");
        carregarEstadoBolao(currentAdminGameId);
    } catch (error) {
        if (!silent) alert(error.message || "Erro ao salvar jogadores.");
    }
}

async function buscarSorteioCartola() {
    if (!currentAdminGameId) {
        alert("Selecione um jogo primeiro!");
        return;
    }

    const btn = document.getElementById('btn-sorteio-cartola');
    if (btn) btn.disabled = true;

    try {
        const sorteio = await ApiBolaoService.realizarSorteio(currentAdminGameId);
        
        // Precisamos descobrir qual é o Flamengo
        let timeSorteado = null;
        
        if (sorteio.mandante.nome.toLowerCase().includes('flamengo')) {
            timeSorteado = sorteio.mandante.jogadores;
        } else if (sorteio.visitante.nome.toLowerCase().includes('flamengo')) {
            timeSorteado = sorteio.visitante.jogadores;
        } else {
            // Fallback caso o Flamengo não esteja no jogo (pega o mandante)
            timeSorteado = sorteio.mandante.jogadores;
        }

        if (!timeSorteado || timeSorteado.length === 0) {
            throw new Error("A escalação do Flamengo retornou vazia da API do Cartola.");
        }

        const jogadoresTransformados = timeSorteado.map((j, i) => ({
            id: i + 1,
            nomeJogador: `${j.nome} (${j.posicao})`
        }));

        renderizarInputsJogadores(jogadoresTransformados);
        
        await salvarJogadores(true); // Salva silenciosamente
        
        alert("Escalação buscada, preenchida e salva automaticamente! Edite se necessário.");
    } catch (error) {
        alert(error.message || "Erro ao buscar escalação no Cartola.");
    } finally {
        if (btn) btn.disabled = false;
    }
}

function embaralharJogadoresInputs() {
    const inputs = [];
    for(let i = 1; i <= 10; i++) {
        const el = document.getElementById(`jogador-input-${i}`);
        if (el) inputs.push(el.value);
    }

    const preenchidos = inputs.filter(v => v.trim() !== '');
    if (preenchidos.length < 2) {
        alert("Preencha pelo menos 2 jogadores para embaralhar.");
        return;
    }

    // Fisher-Yates shuffle
    for (let i = preenchidos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [preenchidos[i], preenchidos[j]] = [preenchidos[j], preenchidos[i]];
    }

    let pIndex = 0;
    for(let i = 1; i <= 10; i++) {
        const el = document.getElementById(`jogador-input-${i}`);
        if (el && el.value.trim() !== '') {
            el.value = preenchidos[pIndex];
            pIndex++;
        }
    }
}

async function zerarApostas() {
    if (!currentAdminGameId) {
        alert("Selecione um jogo primeiro!");
        return;
    }
    if(!confirm("Tem certeza que deseja APAGAR todas as apostas e resetar este jogo?")) return;
    
    try {
        await ApiBolaoService.limparJogo(currentAdminGameId);
        alert("Todas as apostas e o sorteio foram apagados.");
        carregarEstadoBolao(currentAdminGameId);
    } catch (error) {
        alert(error.message || "Erro ao zerar apostas.");
    }
}

async function inicializarSelecaoJogo() {
    const select = document.getElementById('select-jogo-bolao');
    const btnSalvar = document.getElementById('btn-salvar-jogo');
    if (!select || !btnSalvar) return;

    try {
        loadedJogos = await fetchJogos();
        select.innerHTML = '<option value="" style="background: #1a1a1a; color: #ffffff; padding: 10px;">Selecione o Jogo do Bolão</option>';

        loadedJogos.forEach(jogo => {
            const option = document.createElement('option');
            option.value = jogo.id;
            option.style.background = '#1a1a1a';
            option.style.color = '#ffffff';
            option.style.padding = '10px';
            
            const dataCurta = jogo.dataFormatada.substring(0, 5); 
            option.textContent = `${jogo.campeonato}: ${jogo.timeCasa} x ${jogo.timeFora} (${dataCurta})`;
            
            select.appendChild(option);
        });

        const config = await ApiBolaoService.obterConfiguracaoGlobais();
        if (config && config.idJogoAtivo) {
            select.value = config.idJogoAtivo;
            currentAdminGameId = config.idJogoAtivo;
            renderPreview(config.idJogoAtivo);
            carregarEstadoBolao(config.idJogoAtivo);
        }

        select.addEventListener('change', (e) => {
            currentAdminGameId = e.target.value;
            renderPreview(e.target.value);
            carregarEstadoBolao(e.target.value);
        });

        btnSalvar.addEventListener('click', async () => {
            if (select.value) {
                try {
                    await ApiBolaoService.salvarConfiguracaoGlobais(select.value);
                    currentAdminGameId = select.value;
                    alert('Jogo salvo como Bolão Ativo na API!');
                    renderPreview(select.value);
                    carregarEstadoBolao(select.value);
                } catch (error) {
                    alert(error.message || 'Erro ao salvar jogo ativo.');
                }
            } else {
                alert('Selecione um jogo válido.');
            }
        });

    } catch (error) {
        select.innerHTML = '<option value="">Erro ao carregar jogos</option>';
        console.error(error);
    }
}

function renderPreview(gameId) {
    const previewBlock = document.getElementById('admin-preview-game');
    const previewContainer = document.getElementById('admin-preview-game-container');

    if (!previewBlock || !previewContainer) return;
    if (!gameId) {
        previewBlock.style.display = 'none';
        return;
    }
    
    const selectedGame = loadedJogos.find(j => j.id == gameId);
    if (selectedGame) {
        previewContainer.innerHTML = '';
        const cardDestaque = new CardNextGame([selectedGame]);
        previewContainer.appendChild(cardDestaque);
        previewBlock.style.display = 'block';
    } else {
        previewBlock.style.display = 'none';
    }
}

function renderizarPagamentos(slots) {
    const container = document.getElementById('bolao-pagamentos-container');
    if (!container) return;

    container.innerHTML = '';
    if (!slots || slots.length === 0) return;

    slots.forEach(slot => {
        const temParticipante = slot.participante && slot.participante.trim() !== '';
        const isSorteado = slot.jogadorSorteado && slot.jogadorSorteado !== "Aguardando" && slot.jogadorSorteado !== "Não mapeado";
        const isPago = slot.pago === true;

        let textoExibicao = 'Vaga Disponível';
        if (temParticipante) {
            textoExibicao = slot.participante; 
        } else if (isSorteado) {
            textoExibicao = `Vaga Livre`;
        }

        const vagaSemApostador = !temParticipante;

        const row = document.createElement('div');
        row.className = 'bolao-pagamento-row';

        const infoAtleta = isSorteado ? ` <small style="font-size: 12px;">— Jogador: ${escapeHTML(slot.jogadorSorteado)}</small>` : '';
        const participanteEscapado = escapeHTML(slot.participante || '');

        row.innerHTML = `
            <div class="pagamento-info">
                <span class="pagamento-num">${slot.numeroSlot}</span>
                <div style="display:flex; flex-direction:column; gap:4px;">
                    <input type="text" class="input-nome-pagamento" value="${participanteEscapado}" placeholder="Vaga Disponível" data-slot="${slot.numeroSlot}" />
                    <span style="font-size: 0.75rem; color: rgba(255,255,255,0.8);">${infoAtleta}</span>
                </div>
            </div>
            <div class="pagamento-acoes">
                <button class="btn-pagamento ${isPago ? 'pago' : 'pendente'}" data-slot="${slot.numeroSlot}" ${vagaSemApostador ? 'disabled' : ''} title="Mudar Status de Pagamento">
                    <i class="${isPago ? 'ri-check-line' : 'ri-time-line'}"></i> 
                    ${isPago ? 'Pago' : 'Pendente'}
                </button>
                <button class="btn-icon edit save-btn" title="Salvar Nome" data-slot="${slot.numeroSlot}">
                    <i class="ri-save-line"></i>
                </button>
                <button class="btn-icon delete" title="Remover Aposta" data-slot="${slot.numeroSlot}" ${vagaSemApostador ? 'style="visibility:hidden;"' : ''}>
                    <i class="ri-delete-bin-line"></i>
                </button>
            </div>
        `;

        const btnToggle = row.querySelector('.btn-pagamento');
        if (btnToggle) {
            btnToggle.addEventListener('click', (e) => {
                const num = e.currentTarget.getAttribute('data-slot');
                alternarPagamentoAPI(num);
            });
        }

        const btnEdit = row.querySelector('.edit');
        const inputNome = row.querySelector('.input-nome-pagamento');
        
        if (btnEdit && inputNome) {
            btnEdit.addEventListener('click', (e) => {
                const num = e.currentTarget.getAttribute('data-slot');
                salvarNomeAPI(num, inputNome.value);
            });
            
            // Permite salvar apertando Enter
            inputNome.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const num = e.currentTarget.getAttribute('data-slot');
                    salvarNomeAPI(num, inputNome.value);
                }
            });
        }

        const btnDelete = row.querySelector('.delete');
        if (btnDelete) {
            btnDelete.addEventListener('click', (e) => {
                const num = e.currentTarget.getAttribute('data-slot');
                limparApostaAPI(num);
            });
        }

        container.appendChild(row);
    });
}

async function alternarPagamentoAPI(numeroSlot) {
    if (!currentAdminGameId) return;
    try {
        await ApiBolaoService.alternarPagamento(currentAdminGameId, numeroSlot);
        carregarEstadoBolao(currentAdminGameId);
    } catch (error) {
        alert(error.message || "Erro ao alternar pagamento.");
    }
}

async function limparApostaAPI(numeroSlot) {
    if (!currentAdminGameId) return;
    if (!confirm("Tem certeza que deseja remover esta aposta?")) return;
    
    try {
        await ApiBolaoService.deletarAposta(currentAdminGameId, numeroSlot);
        carregarEstadoBolao(currentAdminGameId);
    } catch (error) {
        alert(error.message || "Erro ao deletar aposta.");
    }
}

async function salvarNomeAPI(numeroSlot, novoNome) {
    if (!currentAdminGameId) return;
    
    if (novoNome.trim() === "") {
        limparApostaAPI(numeroSlot);
        return;
    }

    try {
        await ApiBolaoService.alterarNomeParticipante(currentAdminGameId, numeroSlot, novoNome.trim());
        carregarEstadoBolao(currentAdminGameId);
        alert(`Nome do participante salvo com sucesso para o número ${numeroSlot}!`);
    } catch (error) {
        alert(error.message || "Erro ao alterar nome do participante.");
    }
}

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

console.log("Interface visual de Gerenciar Bolão (Semi-Automático) conectada com sucesso!");