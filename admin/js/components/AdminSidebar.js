class AdminSidebar extends HTMLElement {
    async connectedCallback() {
        try {
            const response = await fetch('./components_html/adminSidebar.html');
            const pureHtml = await response.text();

            this.innerHTML = `
                <link rel="stylesheet" href="./css/components/adminSidebar.css">
                ${pureHtml}
            `;

            // Verifica permissão para exibir "Gerenciar Administradores"
            try {
                const user = JSON.parse(localStorage.getItem('adminUser'));
                if (user && user.role !== 'super-admin') {
                    const adminLink = this.querySelector('#link-admin');
                    if (adminLink && adminLink.parentElement) {
                        adminLink.parentElement.style.display = 'none';
                    }
                }
            } catch (e) {
                console.error("Erro ao processar usuário local", e);
            }

            this.setActiveLink();
        } catch (error) {
            console.error('Erro ao carregar o HTML do admin sidebar:', error);
        }
    }

    setActiveLink() {
        const path = window.location.pathname;
        const links = this.querySelectorAll('.admin-menu a');
        
        let foundActive = false;

        links.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            if (href !== '#' && path.includes(href)) {
                link.classList.add('active');
                foundActive = true;
            }
        });

        // Se nenhum link estiver ativo (ex: acessou apenas /admin/), ativa a Visão Geral
        if (!foundActive && (path.endsWith('/admin/') || path.endsWith('/admin'))) {
            const dashLink = this.querySelector('#link-dashboard');
            if (dashLink) dashLink.classList.add('active');
        }

        // Lógica do botão Fechar Menu (Mobile)
        const btnClose = this.querySelector('#close-admin-menu');
        if (btnClose) {
            btnClose.addEventListener('click', () => {
                const sidebar = this.querySelector('.admin-sidebar');
                if (sidebar) sidebar.classList.remove('active');
            });
        }

        // Lógica de Logout no Menu Mobile
        const btnLogoutMobile = this.querySelector('#btn-admin-logout-mobile');
        if (btnLogoutMobile) {
            btnLogoutMobile.addEventListener('click', () => {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
                window.location.href = '../login.html';
            });
        }
    }
}

customElements.define('admin-sidebar', AdminSidebar);
