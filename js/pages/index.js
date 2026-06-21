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

if (!localStorage.getItem('user')) {
    const adminFalso = {
        name: "Admin Provisório",
        role: "admin",
        token: "mocked-jwt-token-xyz123"
    };
    localStorage.setItem('user', JSON.stringify(adminFalso));
}

document.addEventListener('DOMContentLoaded', async () => {
    const containerPrincipal = document.getElementById('match-fla');
    if (!containerPrincipal) return;

    const loader = document.createElement('div');
    loader.innerHTML = '<p style="text-align: center; color: white;">Carregando jogos...</p>';
    containerPrincipal.appendChild(loader);

    try {
        const jogosDaRodada = await fetchJogos();
        
        containerPrincipal.innerHTML = ''; // Remove loader

        if (jogosDaRodada.length === 0) {
            containerPrincipal.innerHTML = '<p style="text-align: center; color: white;">Nenhum jogo disponível no momento.</p>';
            return;
        }

        // Passa a lista de jogos reais para o componente
        const cardDestaque = new CardNextGame(jogosDaRodada);
        containerPrincipal.appendChild(cardDestaque);
    } catch (error) {
        containerPrincipal.innerHTML = '<p style="text-align: center; color: white;">Erro ao carregar jogos.</p>';
        console.error("Erro renderizando CardNextGame:", error);
    }
});
