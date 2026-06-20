document.addEventListener('DOMContentLoaded', () => {
    renderDashboard();
});

function renderDashboard() {
    const container = document.getElementById('dashboard-content');
    if (!container) return;

    // Busca o total de itens
    let totalCardapio = 24; // fallback
    try {
        const dadosCardapio = obterCardapioLocal();
        if (dadosCardapio) {
            totalCardapio = (dadosCardapio.bebidas?.length || 0) + 
                            (dadosCardapio.petiscos?.length || 0) + 
                            (dadosCardapio.pratos?.length || 0);
        }
    } catch(e) {
        console.error("Erro ao ler cardápio", e);
    }

    // Dados que viriam do Backend
    const kpis = [
        { icone: 'ri-newspaper-line', valor: '12', label: 'Notícias Publicadas' },
        { icone: 'ri-restaurant-line', valor: totalCardapio.toString(), label: 'Itens no Cardápio' },
        { icone: 'ri-shopping-bag-line', valor: '8', label: 'Produtos na Loja' }
    ];

    const actions = [
        { link: 'noticias.html', icone: 'ri-edit-box-line', label: 'Nova Notícia', isButton: false },
        { link: 'cardapio.html?action=novo-item', icone: 'ri-restaurant-line', label: 'Adicionar ao Cardápio', isButton: false },
        { link: '#', icone: 'ri-check-line', label: 'Encerrar Bolão', isButton: true }
    ];

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
            <div class="quick-actions">
                ${actions.map(action => {
                    if (action.isButton) {
                        return `
                            <button class="btn-quick-action">
                                <i class="${action.icone}"></i>
                                ${action.label}
                            </button>
                        `;
                    }
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
}
