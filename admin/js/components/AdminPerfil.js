export default class AdminPerfil extends HTMLElement {
    async connectedCallback() {
        try {
            const resposta = await fetch('./components_html/adminPerfil.html');
            const htmlPuro = await resposta.text();
            
            this.innerHTML = htmlPuro;
            
            this.carregarDadosPerfil();
            this.inicializarEventos();
            
        } catch (erro) {
            console.error("Erro ao carregar o HTML do perfil:", erro);
        }
    }

    carregarDadosPerfil() {
        try {
            const userStr = localStorage.getItem('adminUser');
            if (!userStr) return; 

            const user = JSON.parse(userStr);
            const cargoElement = this.querySelector('#perfil-cargo');
            const nomeElement = this.querySelector('#perfil-nome');
            const emailElement = this.querySelector('#perfil-email');

            if (nomeElement) nomeElement.value = user.nome || "Administrador";
            if (emailElement) emailElement.value = user.email || "admin@example.com";

            if (cargoElement) {
                cargoElement.textContent = user.role === 'super-admin' ? 'Super Administrador' : 'Administrador';
            }
        } catch (e) {
            console.error("Erro ao processar dados do perfil local.", e);
        }
    }

    inicializarEventos() {
        const btnAlterarSenha = this.querySelector('#btn-alterar-senha');
        const botoesEditar = this.querySelectorAll('.btn-icon-perfil');

        botoesEditar.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const container = e.currentTarget.closest('.input-with-icon');
                const input = container.querySelector('input');
                const icon = e.currentTarget.querySelector('i');
                const button = e.currentTarget;

                if (input.disabled) {
                    // Ativar Edição
                    input.disabled = false;
                    input.classList.remove('disabled-input');
                    input.focus();
                    icon.className = 'ri-check-line';
                    
                    button.style.backgroundColor = 'var(--red-fla, #E11A22)'; 
                    button.style.borderColor = 'var(--red-fla, #E11A22)';
                    button.title = 'Salvar';
                } else {
                    // "Salvar" - Fazer a requisição para API
                    
                    // Estado de carregamento visual
                    icon.className = 'ri-loader-4-line';
                    button.disabled = true;

                    try {
                        const userStr = localStorage.getItem('adminUser');
                        if (!userStr) return;
                        
                        const user = JSON.parse(userStr);
                        const token = localStorage.getItem('adminToken');
                        
                        const payload = {};
                        if (input.id === 'perfil-nome') payload.nome = input.value;
                        if (input.id === 'perfil-email') payload.email = input.value;

                        const response = await fetch(`http://localhost:4000/api/usuarios/${user.id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify(payload)
                        });

                        const data = await response.json();

                        if (response.ok && data.success) {
                            // Atualizar localStorage com os novos dados
                            if (input.id === 'perfil-nome') user.nome = input.value;
                            if (input.id === 'perfil-email') user.email = input.value;
                            localStorage.setItem('adminUser', JSON.stringify(user));
                            
                            // Sucesso Visual
                            input.disabled = true;
                            input.classList.add('disabled-input');
                            icon.className = 'ri-pencil-line';
                            button.style.backgroundColor = ''; 
                            button.style.borderColor = ''; 
                            button.title = 'Editar';
                        } else {
                            alert(data.error || "Erro ao atualizar dados do perfil.");
                            icon.className = 'ri-check-line';
                        }
                    } catch(err) {
                        console.error("Erro ao atualizar perfil na API", err);
                        alert("Erro de conexão com o servidor.");
                        icon.className = 'ri-check-line';
                    } finally {
                        button.disabled = false;
                    }
                }
            });
        });
        
        if (btnAlterarSenha) {
            btnAlterarSenha.addEventListener('click', () => {
                const modalPerfilComponent = document.querySelector('modal-perfil');
                if (modalPerfilComponent) {
                    modalPerfilComponent.abrirModal();
                }
            });
        }

        // Listener para o evento do Modal
        document.addEventListener('salvar-senha-perfil', async (e) => {
            const { senhaAtual, novaSenha } = e.detail;
            
            try {
                const userStr = localStorage.getItem('adminUser');
                if (!userStr) return;
                
                const user = JSON.parse(userStr);
                const token = localStorage.getItem('adminToken');
                
                // Nota: O backend atual não verifica a "senhaAtual" por padrão no PUT.
                // Mas enviar a nova senha vai atualizar usando a rota PUT normal.
                const response = await fetch(`http://localhost:4000/api/usuarios/${user.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ password: novaSenha })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    alert('Senha atualizada com sucesso!');
                    const modalPerfilComponent = document.querySelector('modal-perfil');
                    if (modalPerfilComponent) modalPerfilComponent.fecharModal();
                } else {
                    alert(data.error || 'Erro ao atualizar a senha.');
                }

            } catch (err) {
                console.error("Erro ao atualizar senha na API", err);
                alert("Erro de conexão com o servidor.");
            }
        });
    }
}

customElements.define('admin-perfil', AdminPerfil);
