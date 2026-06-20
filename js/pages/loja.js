// Array de testes com os produtos da loja
const listaProdutos = [
    {
        id: 1,
        titulo: "Camisa do Consulado",
        descricao: "Venha garantir sua camisa e se junte com a melhor torcida de Quixadá!",
        preco: "120,00 R$",
        imagem: "https://imgcentauro-a.akamaihd.net/1024x1024/9973SK2VA12.jpg" // 
    },
    {
        id: 2,
        titulo: "Copo Personalizado",
        descricao: "Venha garantir seu copo e se junte com a melhor torcida de Quixadá!",
        preco: "35,00 R$",
        imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR88Xlwetvynptbf9j7Qa3bd6jVyzRFmRzmpg&s" 
    }
];

document.addEventListener("DOMContentLoaded", () => {
    const containerProdutos = document.getElementById("products");

    if (!containerProdutos) {
        console.warn("Elemento #products não foi encontrado na página.");
        return;
    }

    containerProdutos.innerHTML = "";

    listaProdutos.forEach(produto => {
        const novoCard = document.createElement("card-item-fla");
        
        // Configura os atributos que o componente espera receber
        novoCard.setAttribute("img", produto.imagem);
        novoCard.setAttribute("title", produto.titulo);
        novoCard.setAttribute("description", produto.descricao);
        novoCard.setAttribute("price", produto.preco);

        containerProdutos.appendChild(novoCard);
    });
});