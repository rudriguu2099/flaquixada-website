import '../components/navbar.js';
import '../components/CardLive.js';
import '../components/Carousel.js';
import '../components/CardItemStore.js';
import '../components/Footer.js';
import { ApiProdutoService } from '../services/ApiProdutoService.js';

document.addEventListener("DOMContentLoaded", async () => {
    const containerProdutos = document.getElementById("products");
    if (!containerProdutos) return;

    // Mantém o skeleton enquanto carrega
    try {
        const produtos = await ApiProdutoService.fetchProdutos();

        containerProdutos.innerHTML = "";

        if (!produtos || produtos.length === 0) {
            containerProdutos.innerHTML = `
                <div style="text-align:center; padding: 60px; color: rgba(255,255,255,0.4); grid-column: 1/-1;">
                    <i class="ri-inbox-line" style="font-size: 3rem;"></i>
                    <p>Nenhum produto disponível no momento.</p>
                </div>
            `;
            return;
        }

        produtos.forEach(produto => {
            const novoCard = document.createElement("card-item-fla");

            novoCard.setAttribute("img", ApiProdutoService.getUrlFoto(produto._id));
            novoCard.setAttribute("title", produto.nome);
            novoCard.setAttribute("description", produto.descricao || '');
            novoCard.setAttribute("price", `R$ ${parseFloat(produto.preco).toFixed(2)}`);

            containerProdutos.appendChild(novoCard);
        });

    } catch (error) {
        console.error("Erro ao carregar produtos da loja:", error);
        containerProdutos.innerHTML = `
            <div style="text-align:center; padding: 60px; color: rgba(255,255,255,0.4); grid-column: 1/-1;">
                <i class="ri-wifi-off-line" style="font-size: 3rem;"></i>
                <p>Não foi possível carregar os produtos. Tente novamente mais tarde.</p>
            </div>
        `;
    }
});