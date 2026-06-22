document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const btnSubmit = document.querySelector('.btn-entrar');
            
            // Validação local básica baseada no Zod do Backend
            if (password.length < 8) {
                alert("A senha deve conter no mínimo 8 caracteres.");
                return;
            }
            
            // Estado de carregamento visual no botão
            const originalText = btnSubmit.innerHTML;
            btnSubmit.innerHTML = 'AUTENTICANDO... <i class="ri-loader-4-line"></i>';
            btnSubmit.disabled = true;
            btnSubmit.style.opacity = '0.7';

            try {
                const response = await fetch('http://localhost:4000/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    // Salvar o JWT Token e os dados do usuário no LocalStorage
                    localStorage.setItem('adminToken', data.data.token);
                    localStorage.setItem('adminUser', JSON.stringify(data.data.user));
                    
                    window.location.href = './admin/index.html';
                } else {
                    let errorMsg = data.error || 'Erro ao realizar login.';
                    if (data.detalhes) {
                        const mensagens = Object.values(data.detalhes).flat().join('\n');
                        errorMsg += '\n' + mensagens;
                    }
                    alert(errorMsg);
                }
            } catch (error) {
                console.error("Erro no login:", error);
                alert("Erro de conexão com o servidor. O backend (Node.js) está rodando");
            } finally {
                // Restaurar botão
                btnSubmit.innerHTML = originalText;
                btnSubmit.disabled = false;
                btnSubmit.style.opacity = '1';
            }
        });
    }
});
