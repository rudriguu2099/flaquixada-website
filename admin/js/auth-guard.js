// Executado imediatamente para proteger a rota do admin
(function checkAuth() {
    const token = localStorage.getItem('adminToken');
    let userStr = localStorage.getItem('adminUser');
    
    if (!token || !userStr) {
        console.warn("Acesso negado: Usuário não autenticado.");
        window.location.replace('../login.html');
        return;
    }

    // Proteção adicional baseada na Role para a tela de admins
    if (window.location.pathname.includes('administradores.html')) {
        try {
            const user = JSON.parse(userStr);
            if (user.role !== 'super-admin') {
                alert('Acesso negado. Apenas o SuperAdmin pode acessar essa página.');
                window.location.replace('index.html');
            }
        } catch (e) {
            window.location.replace('../login.html');
        }
    }
})();
