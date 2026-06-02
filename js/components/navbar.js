class Navbar extends HTMLElement {
  async connectedCallback() {
    try {
      // Busca o arquivo HTML
      const resposta = await fetch('./components_html/navbar.html');
      const htmlPuro = await resposta.text();

      // Injeta o CSS e o HTML
      this.innerHTML = `
        <link rel="stylesheet" href="./css/components/navbar.css">
        ${htmlPuro}
      `;

      this.configurarMenu();

    } catch (error) {
      console.error('Erro ao carregar o HTML do navbar:', error);
    }
  }
  
  configurarMenu() {
    const openBtn = this.querySelector('#open-menu');
    const closeBtn = this.querySelector('#close-menu');
    const sidebar = this.querySelector('#sidebar-menu');
    const overlay = this.querySelector('#sidebar-overlay');

    // Função para abrir
    if (openBtn) {
      openBtn.addEventListener('click', () => {
        sidebar.classList.add('active');
        overlay.classList.add('active');
      });
    }

    // Função para fechar no botão 'X'
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
      });
    }

    // Função para fechar clicando fora (no fundo escuro)
    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
      });
    }
  }
}

customElements.define('nav-bar', Navbar);