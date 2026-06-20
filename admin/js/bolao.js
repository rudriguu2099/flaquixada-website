// Módulos globais do painel
import './components/AdminSidebar.js';
import './components/AdminHeader.js';

document.addEventListener('DOMContentLoaded', () => {
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

    renderizarInputsJogadores();
});

function renderizarInputsJogadores() {
    const container = document.getElementById('bolao-jogadores-container');
    if (!container) return;

    const jogadoresIniciais = [
        "Varela", "Fabrício Bruno", "Léo Pereira", "Ayrton Lucas", "Erick Pulgar",
        "De La Cruz", "Gerson", "Arrascaeta", "Everton Cebolinha", "Pedro"
    ];

    container.innerHTML = '';

    for (let i = 0; i < 10; i++) {
        const row = document.createElement('div');
        row.className = 'bolao-jogador-row';
        
        row.innerHTML = `
            <div class="bolao-jogador-number">${i + 1}</div>
            <div class="bolao-jogador-input-group">
                <label>Jogador ${i + 1}</label>
                <input type="text" class="input-jogador" id="jogador-input-${i+1}" placeholder="Nome do Jogador" value="${jogadoresIniciais[i] || ''}">
            </div>
        `;
        
        container.appendChild(row);
    }
}

console.log("Interface visual de Gerenciar Bolão carregada com sucesso.");
