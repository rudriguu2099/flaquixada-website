class Navbar extends HTMLElement {
  async connectedCallback() {
    try {
      // Busca o arquivo HTML
      const baseUrl = window.APP_BASE_URL || './';
      const resposta = await fetch(`${baseUrl}components_html/navbar.html`);
      const htmlPuro = await resposta.text();

      // Injeta o CSS e o HTML
      this.innerHTML = `
        <link rel="stylesheet" href="${baseUrl}css/components/navbar.css">
        ${htmlPuro}
      `;

      this.configurarMenu();
      this.destacarPaginaAtual();

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

  destacarPaginaAtual() {
    let path = window.location.pathname;
    let paginaAtual = path.split('/').pop();
    
    // Fallback para raiz
    if (!paginaAtual || paginaAtual === '') {
        paginaAtual = 'index.html';
    }

    // Busca os links do menu topbar e da sidebar
    const links = this.querySelectorAll('.menu.extends a, .sidebar-links a');
    
    links.forEach(link => {
      const href = link.getAttribute('href');

      if (href && href.includes(paginaAtual) && paginaAtual !== 'login.html') {
         link.classList.add('active-link');
      }
    });
  }
}

customElements.define('nav-bar', Navbar);