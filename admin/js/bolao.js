// Módulos globais do painel
import './components/AdminSidebar.js';
import './components/AdminHeader.js';
import { fetchJogos } from '../../js/services/ApiJogosService.js';
import '../../js/components/NextGame.js';
import '../../js/components/CardNextGame.js';

let currentState = 'INATIVO';
let loadedJogos = [];

document.addEventListener('DOMContentLoaded', () => {
    inicializarToggleJogadores();
    inicializarEstadoBolao();
    renderizarInputsJogadores();

    const btnSalvar = document.getElementById('btn-salvar-jogadores');
    if (btnSalvar) {
        btnSalvar.addEventListener('click', salvarJogadoresMock);
    }

    const btnZerar = document.getElementById('btn-zerar-apostas');
    if (btnZerar) {
        btnZerar.addEventListener('click', zerarApostasMock);
    }

    const btnEmbaralhar = document.getElementById('btn-embaralhar-jogadores');
    if (btnEmbaralhar) {
        btnEmbaralhar.addEventListener('click', embaralharJogadores);
    }

    inicializarSelecaoJogo();
    inicializarTogglePagamentos();
    renderizarPagamentos();
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

function inicializarEstadoBolao() {
    const savedState = localStorage.getItem('bolao_mock_state');
    if (savedState) {
        currentState = savedState;
    } else {
        localStorage.setItem('bolao_mock_state', currentState);
    }

    atualizarUIEstado();

    const btnsState = document.querySelectorAll('.btn-state');
    btnsState.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const newState = e.currentTarget.getAttribute('data-state');
            mudarEstadoBolao(newState);
        });
    });
}

function mudarEstadoBolao(newState) {
    if (currentState === newState) return;
    
    currentState = newState;
    localStorage.setItem('bolao_mock_state', currentState);
    atualizarUIEstado();
    
    alert(`Estado do bolão alterado para: ${newState}`);
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

function carregarJogadoresMock() {
    const saved = localStorage.getItem('bolao_mock_jogadores');
    if (saved) {
        return JSON.parse(saved);
    }
    const iniciais = [];
    for(let i=1; i<=10; i++) iniciais.push({ id: i, nomeJogador: "", participante: "" });
    return iniciais;
}

// 1. APENAS OS JOGADORES DO TIME AQUI (Foco total na escalação)
function renderizarInputsJogadores() {
    const container = document.getElementById('bolao-jogadores-container');
    if (!container) return;

    const jogadores = carregarJogadoresMock();
    container.innerHTML = '';

    jogadores.forEach((j, index) => {
        const row = document.createElement('div');
        row.className = 'bolao-jogador-row';
        
        row.innerHTML = `
            <div class="bolao-jogador-number">${index + 1}</div>
            <div class="bolao-jogador-input-group" style="width: 100%;">
                <label>Jogador ${index + 1}</label>
                <input type="text" class="input-jogador" id="jogador-input-${index+1}" placeholder="Nome do Atleta ${index+1}" value="${j.nomeJogador || ''}">
            </div>
        `;
        
        container.appendChild(row);
    });
}

function salvarJogadoresMock() {
    const old = carregarJogadoresMock();
    const jogadores = [];

    for(let i = 1; i <= 10; i++) {
        const input = document.getElementById(`jogador-input-${i}`);
        const nomeInformado = input ? input.value.trim() : '';
        const jogadorAntigo = old.find(j => j.id === i);

        const participanteAtual = jogadorAntigo ? jogadorAntigo.participante : '';
        const pagoAtual = jogadorAntigo ? jogadorAntigo.pago : false;

        jogadores.push({
            id: i,
            nomeJogador: nomeInformado,
            participante: participanteAtual, // Preserva quem apostou no front
            pago: nomeInformado === '' ? false : (pagoAtual || false)
        });
    }

    localStorage.setItem('bolao_mock_jogadores', JSON.stringify(jogadores));
    
    renderizarPagamentos();
    alert("Lista de jogadores salva com sucesso! O bolão pode ser aberto.");
}

function zerarApostasMock() {
    if(!confirm("Tem certeza que deseja apagar todas as apostas dos usuários?")) return;
    
    const jogadores = carregarJogadoresMock();
    jogadores.forEach(j => j.participante = "");
    localStorage.setItem('bolao_mock_jogadores', JSON.stringify(jogadores));
    
    mudarEstadoBolao('INATIVO');
    renderizarInputsJogadores();
    renderizarPagamentos();
    
    alert("Todas as apostas foram apagadas. O bolão voltou para INATIVO.");
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

        const previewBlock = document.getElementById('admin-preview-game');
        const previewContainer = document.getElementById('admin-preview-game-container');

        const renderPreview = (gameId) => {
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
        };

        const savedGameId = localStorage.getItem('bolao_mock_game_id');
        if (savedGameId) {
            select.value = savedGameId;
            renderPreview(savedGameId);
        }

        select.addEventListener('change', (e) => {
            renderPreview(e.target.value);
        });

        btnSalvar.addEventListener('click', () => {
            if (select.value) {
                localStorage.setItem('bolao_mock_game_id', select.value);
                alert('Jogo saved com sucesso!');
                renderPreview(select.value);
            } else {
                alert('Selecione um jogo válido.');
            }
        });

    } catch (error) {
        select.innerHTML = '<option value="">Erro ao carregar jogos</option>';
        console.error(error);
    }
}

function embaralharJogadores() {
    const jogadoresAtuais = carregarJogadoresMock();
    
    const itensParaEmbaralhar = jogadoresAtuais
        .filter(j => j.nomeJogador && j.nomeJogador.trim() !== '')
        .map(j => ({ nomeJogador: j.nomeJogador, pago: j.pago || false }));

    if (itensParaEmbaralhar.length < 2) {
        alert("Preencha e salve pelo menos 2 jogadores para poder embaralhar.");
        return;
    }

    let shuffled = [...itensParaEmbaralhar];
    let attempts = 0;
    let derangement = false;

    while (!derangement && attempts < 100) {
        attempts++;
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        derangement = true;
        for (let i = 0; i < itensParaEmbaralhar.length; i++) {
            if (shuffled[i].nomeJogador === itensParaEmbaralhar[i].nomeJogador) {
                derangement = false;
                break;
            }
        }
    }

    let indexEmbaralhado = 0;
    const novosJogadores = jogadoresAtuais.map(j => {
        if (j.nomeJogador && j.nomeJogador.trim() !== '') {
            const dadosSorteados = shuffled[indexEmbaralhado];
            indexEmbaralhado++;
            return {
                id: j.id,
                nomeJogador: dadosSorteados.nomeJogador,
                participante: j.participante || '', 
                pago: dadosSorteados.pago
            };
        }
        return j; 
    });

    localStorage.setItem('bolao_mock_jogadores', JSON.stringify(novosJogadores));
    
    renderizarInputsJogadores();
    renderizarPagamentos();
    alert("Jogadores embaralhar com sucesso!");
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


function renderizarPagamentos() {
    const container = document.getElementById('bolao-pagamentos-container');
    if (!container) return;

    const jogadores = carregarJogadoresMock();
    container.innerHTML = '';

    jogadores.forEach(j => {
        const temParticipante = j.participante && j.participante.trim() !== '';
        const temNomeJogador = j.nomeJogador && j.nomeJogador.trim() !== '';
        const isPago = j.pago === true;

        // Foco no Apostador: Se alguém comprou, mostra o nome dele. 
        // Se o admin já colocou o atleta, exibe em formato secundário ao lado.
        let textoExibicao = 'Vaga Disponível';
        if (temParticipante) {
            textoExibicao = j.participante; 
        } else if (temNomeJogador) {
            textoExibicao = `Vaga Livre (${j.nomeJogador})`;
        }

        const vagaSemApostador = !temParticipante;

        const row = document.createElement('div');
        row.className = 'bolao-pagamento-row';

        // Mostra qual Atleta está atrelado a essa vaga caso já exista
        const infoAtleta = (temParticipante && temNomeJogador) ? ` <small style="opacity: 0.6; font-size: 12px;">— Atleta: ${j.nomeJogador}</small>` : '';

        row.innerHTML = `
            <div class="pagamento-info">
                <span class="pagamento-num">${j.id}</span>
                <span class="pagamento-nome ${vagaSemApostador ? 'vazio' : ''}">
                    ${textoExibicao}${infoAtleta}
                </span>
            </div>
            <div class="pagamento-acoes">
                <button class="btn-pagamento ${isPago ? 'pago' : 'pendente'}" ${vagaSemApostador ? 'disabled' : ''}>
                    <i class="${isPago ? 'ri-check-line' : 'ri-time-line'}"></i> 
                    ${isPago ? 'Pago' : 'Pendente'}
                </button>
                <button class="btn-icon delete" title="Remover Aposta" ${vagaSemApostador ? 'style="visibility:hidden;"' : ''}>
                    <i class="ri-delete-bin-line"></i>
                </button>
            </div>
        `;

        const btnToggle = row.querySelector('.btn-pagamento');
        if (btnToggle) {
            btnToggle.addEventListener('click', () => alternarPagamento(j.id));
        }

        const btnDelete = row.querySelector('.delete');
        if (btnDelete) {
            btnDelete.addEventListener('click', () => limparApostaParticipante(j.id));
        }

        container.appendChild(row);
    });
}

function alternarPagamento(id) {
    const jogadores = carregarJogadoresMock();
    const index = jogadores.findIndex(j => j.id === id);
    
    if (index !== -1 && jogadores[index].participante) {
        jogadores[index].pago = !jogadores[index].pago; 
        localStorage.setItem('bolao_mock_jogadores', JSON.stringify(jogadores));
        renderizarPagamentos(); 
    }
}

// Remove apenas o apostador da vaga sem apagar o jogador definido pelo Admin
function limparApostaParticipante(id) {
    if (!confirm("Tem certeza que deseja remover esta aposta e resetar o pagamento?")) return;
    
    const jogadores = carregarJogadoresMock();
    const index =调 = jogadores.findIndex(j => j.id === id);
    
    if (index !== -1) {
        jogadores[index].participante = "";
        jogadores[index].pago = false; 
        
        localStorage.setItem('bolao_mock_jogadores', JSON.stringify(jogadores));
        
        renderizarInputsJogadores();
        renderizarPagamentos();      
    }
}

window.addEventListener('storage', (e) => {
    if (e.key === 'bolao_mock_jogadores') {
        renderizarInputsJogadores();
        renderizarPagamentos();
    }
});

console.log("Interface visual de Gerenciar Bolão carregada com sucesso.");