// Lógica do Painel de Cardápio

document.addEventListener('DOMContentLoaded', () => {
    console.log("Admin Cardápio inicializado.");
    
    const btnNovo = document.getElementById('btn-novo-item');
    if (btnNovo) {
        btnNovo.addEventListener('click', () => {
            alert('Abrir modal/form para novo item de cardápio!');
        });
    }
});
