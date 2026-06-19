class AdminHeader extends HTMLElement {
    async connectedCallback() {
        try {
            const response = await fetch('./components_html/adminHeader.html');
            const pureHtml = await response.text();

            this.innerHTML = `
                <link rel="stylesheet" href="./css/components/adminHeader.css">
                ${pureHtml}
            `;

            // Lógica de logout
            const btnLogout = this.querySelector('#btn-admin-logout');
            if (btnLogout) {
                btnLogout.addEventListener('click', () => {
                    // Aqui iria a lógica de limpar sessão/token
                    window.location.href = '../index.html'; // Redireciona pro site público
                });
            }
        } catch (error) {
            console.error('Erro ao carregar o HTML do admin header:', error);
        }
    }
}

customElements.define('admin-header', AdminHeader);
