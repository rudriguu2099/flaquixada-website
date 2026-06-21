import { fetchJogos } from '../services/ApiJogosService.js';
import '../components/navbar.js';
import '../components/Bolao.js';
import '../components/NextGame.js';
import '../components/CardNextGame.js';
import '../components/Footer.js';

const jogadoresFlamengo = [
    { id: 1, nomeJogador: "Varela", participante: "Randson" },
    { id: 2, nomeJogador: "Fabrício Bruno", participante: "" },
    { id: 3, nomeJogador: "Léo Pereira", participante: "Henry" },
    { id: 4, nomeJogador: "Ayrton Lucas", participante: "" },
    { id: 5, nomeJogador: "Erick Pulgar", participante: "" },
    { id: 6, nomeJogador: "De La Cruz", participante: "" },
    { id: 7, nomeJogador: "Gerson", participante: "Rudrigu" },
    { id: 8, nomeJogador: "Arrascaeta", participante: "" },
    { id: 9, nomeJogador: "Everton Cebolinha", participante: "" },
    { id: 10, nomeJogador: "Pedro", participante: "" },
];

let currentBolaoState = 'PADRAO'; // 'INATIVO', 'AGUARDANDO', 'PADRAO'

function renderBolaoState() {
    const container = document.getElementById('bolao-dynamic-container');
    if (!container) return;

    if (currentBolaoState === 'INATIVO') {
        container.innerHTML = `
            <div class="bolao-empty-state">
                <i class="ri-lock-2-line"></i>
                <h2>Bolão Inativo</h2>
                <p>O bolão para essa partida logo mais será aberto, fique de olho!</p>
            </div>
        `;
    } else if (currentBolaoState === 'AGUARDANDO') {
        container.innerHTML = `
            <div class="bolao-empty-state">
                <i class="ri-clipboard-line"></i>
                <h2>Aguardando Escalação</h2>
                <p>Estamos fazendo o sorteio da escalação do bolão, em breve divulgaremos!</p>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="bolao-participants-list" id="bolao-participants-list"></div>
            
            <div class="bolao-insert-area" id="bolao-insert-area">
                <p style="margin-bottom: 8px; font-weight: 600; font-size: 0.95rem;">Faça sua aposta:</p>
                <select id="select-jogador" class="bolao-novo-input" style="margin-bottom: 12px;"></select>
                <input type="text" id="novo-participante-nome" class="bolao-novo-input" placeholder="Digite seu nome completo">
                <button id="btn-bolao-salvar" class="btn-bolao btn-bolao-salvar" style="margin-top: 12px;">
                    <i class="ri-check-line"></i> Confirmar Aposta</button>
            </div>
        `;
        renderBolaoList();
        
        const btnSalvar = document.getElementById('btn-bolao-salvar');
        if (btnSalvar) btnSalvar.addEventListener('click', salvarAposta);
    }
}

function renderBolaoList() {
    const list = document.getElementById('bolao-participants-list');
    const select = document.getElementById('select-jogador');
    if (!list || !select) return;

    list.innerHTML = '';
    select.innerHTML = '<option value="" disabled selected>Escolha um jogador disponível...</option>';

    jogadoresFlamengo.forEach(j => {
        // Render Row
        const row = document.createElement('div');
        row.className = 'bolao-participant-row';
        
        const isTaken = j.participante.trim().length > 0;

        row.innerHTML = `
            <div class="bolao-player-info">
                <span class="bolao-participant-number">${j.id}.</span>
                <span class="bolao-player-name">${j.nomeJogador}</span>
            </div>
            <div class="bolao-participant-info">
                ${isTaken ? `<span class="bolao-participant-name taken"><i class="ri-user-check-fill"></i> ${j.participante}</span>` : `<span class="bolao-participant-name free">Disponível</span>`}
            </div>
        `;
        list.appendChild(row);

        // Render Option in Select if available
        if (!isTaken) {
            const option = document.createElement('option');
            option.value = j.id;
            option.textContent = `${j.id}. ${j.nomeJogador}`;
            select.appendChild(option);
        }
    });
}

function salvarAposta() {
    const select = document.getElementById('select-jogador');
    const inputNome = document.getElementById('novo-participante-nome');
    
    if (!select || !inputNome) return;

    const jogadorId = parseInt(select.value);
    const participanteNome = inputNome.value.trim();

    if (!jogadorId) {
        alert('Por favor, selecione um jogador disponível na lista.');
        return;
    }

    if (!participanteNome) {
        alert('Por favor, digite seu nome completo para confirmar a aposta.');
        return;
    }

    const jogador = jogadoresFlamengo.find(j => j.id === jogadorId);
    if (jogador) {
        jogador.participante = participanteNome;
        inputNome.value = '';
        renderBolaoList();
        alert(`Aposta confirmada! Se ${jogador.nomeJogador} fizer o 1º gol, você ganha o prêmio!`);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // Renderiza o bolão pela primeira vez
    renderBolaoState();

    // Carrega e renderiza o Próximo Jogo
    const containerPrincipal = document.getElementById('bolao-jogo-atual');
    if (!containerPrincipal) return;

    const loader = document.createElement('div');
    loader.innerHTML = '<p style="text-align: center; color: white;">Carregando jogo...</p>';
    containerPrincipal.appendChild(loader);

    try {
        const jogosDaRodada = await fetchJogos();
        containerPrincipal.innerHTML = ''; 

        if (jogosDaRodada.length > 0) {
            const cardDestaque = new CardNextGame(jogosDaRodada);
            cardDestaque.setAttribute('custom-title', 'Faça sua aposta');
            cardDestaque.setAttribute('custom-icon', 'ri-trophy-line');
            containerPrincipal.appendChild(cardDestaque);
        } else {
            containerPrincipal.innerHTML = '<p style="text-align: center; color: white;">Nenhum jogo disponível no momento.</p>';
        }
    } catch (error) {
        containerPrincipal.innerHTML = '<p style="text-align: center; color: white;">Erro ao carregar o jogo.</p>';
        console.error("Erro renderizando CardNextGame:", error);
    }
});