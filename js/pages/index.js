import { fetchJogos } from '../services/ApiJogosService.js';
import '../components/navbar.js';
import '../components/CardNextGame.js';
import '../components/CardLive.js';
import '../components/NextGame.js';
import '../components/Bolao.js';
import '../components/DivulgaSocioFla.js';
import '../components/MonthlyPrizes.js';
import '../components/CardCardapio.js';
import '../components/Noticias.js';
import '../components/Footer.js';



document.addEventListener('DOMContentLoaded', async () => {
    const containerPrincipal = document.getElementById('match-fla');
    if (!containerPrincipal) return;

    const loader = document.createElement('div');
    loader.className = 'jogos-loader-container';
    loader.innerHTML = `
        <div class="jogos-spinner"></div>
        <p>Buscando as próximas partidas...</p>
    `;
    containerPrincipal.appendChild(loader);

    try {
        const jogosDaRodada = await fetchJogos();
        
        containerPrincipal.innerHTML = ''; // Remove loader

        if (!jogosDaRodada || jogosDaRodada.length === 0) {
            containerPrincipal.innerHTML = `
                <div class="jogos-empty-state">
                    <div class="empty-icon-wrapper">
                        <i class="ri-calendar-todo-line"></i>
                    </div>
                    <h3>Nenhum jogo agendado</h3>
                    <p>Não encontramos nenhuma partida do Mengão cadastrada para os próximos dias. Fique atento às atualizações!</p>
                </div>
            `;
            return;
        }

        // Passa a lista de jogos reais para o componente
        const cardDestaque = new CardNextGame(jogosDaRodada);
        containerPrincipal.appendChild(cardDestaque);

    } catch (error) {
        containerPrincipal.innerHTML = `
            <div class="jogos-empty-state error">
                <div class="empty-icon-wrapper">
                    <i class="ri-error-warning-line"></i>
                </div>
                <h3>Falha ao carregar jogos</h3>
                <p>Houve um problema de conexão com o servidor. Por favor, verifique sua internet ou tente novamente mais tarde.</p>
                <button class="btn-primary" onclick="window.location.reload()" style="margin-top: 16px; padding: 8px 20px; font-size: 0.9rem;">
                    <i class="ri-refresh-line"></i> Tentar Novamente
                </button>
            </div>
        `;
        console.error("Erro renderizando CardNextGame:", error);
    }
});