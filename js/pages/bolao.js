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

function renderBolao() {
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
        renderBolao();
        alert(`Aposta confirmada! Se ${jogador.nomeJogador} fizer o 1º gol, você ganha o prêmio!`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderBolao();
    
    const btnSalvar = document.getElementById('btn-bolao-salvar');
    if (btnSalvar) btnSalvar.addEventListener('click', salvarAposta);
});