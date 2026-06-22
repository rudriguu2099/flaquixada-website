class DivulgaSocioFla extends HTMLElement {
    async connectedCallback() {
    try {
      // Busca o arquivo HTML
      const resposta = await fetch('./components_html/divulgaSocioFla.html');
      const htmlPuro = await resposta.text();

      // Injeta o CSS e o HTML
      this.innerHTML = `
        <link rel="stylesheet" href="./css/components/divulgaSocioFla.css">
        ${htmlPuro}
      `;

      this.setupButton();

    } catch (error) {
      console.error('Erro ao carregar o HTML do DivulgaSocioFla:', error);
    }
  }

  setupButton() {
      const btnSocio = this.querySelector('#btn-socio-fla');
      if (btnSocio) {
          btnSocio.addEventListener('click', () => {
              const mensagem = "Olá! Gostaria de me associar ao Consulado Fla-Quixadá.";
              const whatsappUrl = `https://wa.me/5588981942857?text=${encodeURIComponent(mensagem)}`;
              window.open(whatsappUrl, '_blank');
          });
      }
  }
}

customElements.define('div-socio-fla', DivulgaSocioFla);