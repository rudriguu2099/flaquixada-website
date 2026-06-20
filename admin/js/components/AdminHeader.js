class AdminHeader extends HTMLElement {
    async connectedCallback() {
        try {
            const response = await fetch('./components_html/adminHeader.html');
            const pureHtml = await response.text();

            this.innerHTML = `
                <link rel="stylesheet" href="./css/components/adminHeader.css">
                ${pureHtml}
            `;

            // Lógica de Logout
            const btnLogout = this.querySelector('#btn-admin-logout');
            if (btnLogout) {
                btnLogout.addEventListener('click', () => {
                    // TODO: Adicionar lógica real de logout (limpar storage/cookies)
                    window.location.href = '../index.html';
                });
            }

            // Lógica do Menu Hamburger (Mobile)
            const btnMenu = this.querySelector('#btn-admin-menu');
            if (btnMenu) {
                btnMenu.addEventListener('click', () => {
                    const sidebar = document.querySelector('.admin-sidebar');
                    if (sidebar) {
                        sidebar.classList.add('active');
                    }
                });
            }
        } catch (error) {
            console.error('Erro ao carregar o HTML do admin header:', error);
        }
    }
}

customElements.define('admin-header', AdminHeader);
