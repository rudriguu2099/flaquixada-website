class CustomFooter extends HTMLElement {
    async connectedCallback() {
        try {
            const response = await fetch('./components_html/footer.html');
            const pureHtml = await response.text();

            this.innerHTML = `
                <link rel="stylesheet" href="./css/components/footer.css">
                ${pureHtml}
            `;
            
            // Atualiza automaticamente o ano atual
            const yearSpan = this.querySelector('.current-year');
            if (yearSpan) {
                yearSpan.textContent = new Date().getFullYear();
            }

        } catch (error) {
            console.error('Erro ao carregar o HTML do footer:', error);
        }
    }
}

customElements.define('custom-footer', CustomFooter);
