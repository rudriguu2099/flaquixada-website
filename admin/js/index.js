import './components/AdminSidebar.js';
import './components/AdminHeader.js';
import { ApiCardapioService } from '../../js/services/ApiCardapioService.js';
import { ApiNoticiasService } from '../../js/services/ApiNoticiasService.js';
import { ApiProdutoService } from '../../js/services/ApiProdutoService.js';

renderDashboard();

async function renderDashboard() {
    const container = document.getElementById('dashboard-content');
    if (!container) return;

    // Busca contagens reais das APIs em paralelo
    let totalCardapio = 0;
    let totalNoticias = 0;
    let totalProdutos = 0;

    const [resultCardapio, resultNoticias, resultProdutos] = await Promise.allSettled([
        ApiCardapioService.fetchCardapio(),
        ApiNoticiasService.fetchNoticias(),
        ApiProdutoService.fetchProdutos()
    ]);

    if (resultCardapio.status === 'fulfilled' && resultCardapio.value) {
        const d = resultCardapio.value;
        totalCardapio = (d.bebidas?.length || 0) + (d.petiscos?.length || 0) + (d.pratos?.length || 0);
    }
    if (resultNoticias.status === 'fulfilled') {
        totalNoticias = resultNoticias.value?.length || 0;
    }
    if (resultProdutos.status === 'fulfilled') {
        totalProdutos = resultProdutos.value?.length || 0;
    }

    // Lê o status do Bolão via API
    let bolaoStatus = 'INATIVO';
    let bolaoIdAtivo = null;
    try {
        // Traz o módulo dinamicamente para não quebrar dependências do dashboard
        const { ApiBolaoService } = await import('../../js/services/ApiBolaoService.js');
        const config = await ApiBolaoService.obterConfiguracaoGlobais();
        if (config && config.idJogoAtivo) {
            bolaoIdAtivo = config.idJogoAtivo;
            const painel = await ApiBolaoService.consultarPainel(bolaoIdAtivo);
            bolaoStatus = painel?.status || 'INATIVO';
        }
    } catch (e) {
        console.error("Erro ao carregar status do bolão:", e);
    }

    const kpis = [
        { icone: 'ri-newspaper-line', valor: totalNoticias.toString(), label: 'Notícias Publicadas' },
        { icone: 'ri-restaurant-line', valor: totalCardapio.toString(), label: 'Itens no Cardápio' },
        { icone: 'ri-shopping-bag-line', valor: totalProdutos.toString(), label: 'Produtos na Loja' }
    ];

    const actions = [
        { link: 'noticias.html?action=novo-item', icone: 'ri-edit-box-line', label: 'Nova Notícia', isButton: false },
        { link: 'cardapio.html?action=novo-item', icone: 'ri-restaurant-line', label: 'Adicionar ao Cardápio', isButton: false },
        { link: 'loja.html?action=novo-produto', icone: 'ri-shopping-bag-line', label: 'Adicionar Produto na Loja', isButton: false }
    ];

    // Helpers para os botões de estado do bolão
    const classInativo = bolaoStatus === 'INATIVO' ? 'active btn-inativo' : '';
    const classAberto = bolaoStatus === 'ABERTO' ? 'active btn-aberto' : '';
    const classFechado = bolaoStatus === 'FECHADO' ? 'active btn-fechado' : '';

    // HTML dinâmico
    let html = `
        <div class="dashboard-stats">
            ${kpis.map(kpi => `
                <div class="stat-card">
                    <div class="stat-icon"><i class="${kpi.icone}"></i></div>
                    <div class="stat-info">
                        <span class="stat-value">${kpi.valor}</span>
                        <span class="stat-label">${kpi.label}</span>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="dashboard-actions-section">
            <h3>Acesso Rápido</h3>
            
            <div class="dashboard-bolao-status">
                <div class="dashboard-bolao-status-header">
                    <h3 class="bolao-widget-title">
                        <span><i class="ri-trophy-line"></i> Status do Bolão:</span> 
                        <strong class="bolao-widget-status">${bolaoStatus}</strong>
                    </h3>
                    <a href="bolao.html" class="btn-secundary btn-manage-bolao"><i class="ri-settings-4-line"></i> Gerenciar</a>
                </div>
                
                <div class="bolao-state-buttons-group">
                    <button id="btn-dash-inativo" class="btn-state ${classInativo}"><i class="ri-lock-2-line"></i> Inativo</button>
                    <button id="btn-dash-aberto" class="btn-state ${classAberto}"><i class="ri-lock-unlock-line"></i> Aberto (Apostas)</button>
                    <button id="btn-dash-fechado" class="btn-state ${classFechado}"><i class="ri-eye-line"></i> Fechado (Revelado)</button>
                </div>
            </div>

            <div class="quick-actions">
                ${actions.map(action => {
                    return `
                        <a href="${action.link}" class="btn-quick-action">
                            <i class="${action.icone}"></i>
                            ${action.label}
                        </a>
                    `;
                }).join('')}
            </div>
        </div>
    `;

    container.innerHTML = html;

    const attachStatusEvent = (btnId, novoStatus, mensagem) => {
        document.getElementById(btnId)?.addEventListener('click', async () => {
            if (bolaoStatus !== novoStatus && confirm(mensagem)) {
                if (!bolaoIdAtivo) {
                    alert('Nenhum jogo configurado no Bolão! Vá para "Gerenciar" e selecione um jogo primeiro.');
                    return;
                }
                try {
                    const { ApiBolaoService } = await import('../../js/services/ApiBolaoService.js');
                    await ApiBolaoService.alterarStatusManual(bolaoIdAtivo, novoStatus);
                    renderDashboard(); // recarrega a página de dashboard atualizada da API
                } catch (e) {
                    alert(e.message || 'Erro ao mudar status do bolão.');
                }
            }
        });
    };

    attachStatusEvent('btn-dash-inativo', 'INATIVO', 'Deseja inativar o bolão?');
    attachStatusEvent('btn-dash-aberto', 'ABERTO', 'Deseja abrir as apostas do bolão?');
    attachStatusEvent('btn-dash-fechado', 'FECHADO', 'Deseja encerrar as apostas e revelar os jogadores?');
}
