// auth-guard.js
// Executado imediatamente para proteger a rota do admin
(function checkAuth() {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    // Se não houver token, redireciona para a tela de login
    if (!token || !user) {
        console.warn("Acesso negado: Usuário não autenticado.");
        window.location.replace('../login.html');
    }
})();
