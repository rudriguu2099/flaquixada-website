const DADOS_CARDAPIO_MOCK = {
    bebidas: [
        { id: 1, nome: 'Brahma Chopp', descricao: 'CERVEJA (600ml)', precoNormal: 12.00, precoSocio: 10.00, categoria: 'bebidas' },
        { id: 2, nome: 'Refrigerante', descricao: 'LATA (350ml)', precoNormal: 6.00, precoSocio: 5.00, categoria: 'bebidas' },
        { id: 3, nome: 'Água Mineral', descricao: 'GARRAFA (500ml)', precoNormal: 4.00, precoSocio: 3.00, categoria: 'bebidas' },
        { id: 4, nome: 'Suco Natural', descricao: 'COPO (300ml)', precoNormal: 8.00, precoSocio: 6.50, categoria: 'bebidas' },
        { id: 5, nome: 'Energético', descricao: 'LATA (250ml)', precoNormal: 10.00, precoSocio: 8.50, categoria: 'bebidas' }
    ],
    petiscos: [
        { id: 6, nome: 'Batatinha', descricao: 'PORÇÃO DE BATATA FRITA', precoNormal: 25.00, precoSocio: 20.00, categoria: 'petiscos' },
        { id: 7, nome: 'Calabresa', descricao: 'PORÇÃO ACEBOLADA', precoNormal: 30.00, precoSocio: 25.00, categoria: 'petiscos' },
        { id: 8, nome: 'Frango', descricao: 'ISCA DE FRANGO GRELHADO', precoNormal: 28.00, precoSocio: 22.00, categoria: 'petiscos' },
        { id: 9, nome: 'Mandioca', descricao: 'PORÇÃO COM MOLHO', precoNormal: 22.00, precoSocio: 18.00, categoria: 'petiscos' },
        { id: 10, nome: 'Mix de Frios', descricao: 'QUEIJO, PRESUNTO E SALAME', precoNormal: 35.00, precoSocio: 28.00, categoria: 'petiscos' }
    ],
    pratos: [
        { id: 11, nome: 'Feijoada', descricao: 'PRATO COMPLETO (SERVE 2)', precoNormal: 45.00, precoSocio: 35.00, categoria: 'pratos' },
        { id: 12, nome: 'Prato Feito', descricao: 'OPÇÃO INDIVIDUAL', precoNormal: 20.00, precoSocio: 18.00, categoria: 'pratos' },
        { id: 13, nome: 'Frango com Arroz', descricao: 'GRELHADO COM ARROZ E SALADA', precoNormal: 24.00, precoSocio: 20.00, categoria: 'pratos' },
        { id: 14, nome: 'Filé à Parmegiana', descricao: 'COM ARROZ E BATATA FRITA', precoNormal: 38.00, precoSocio: 30.00, categoria: 'pratos' }
    ]
};

// Inicializa o mock no localStorage caso não exista
function inicializarMockCardapio() {
    const dadosSalvos = localStorage.getItem('cardapio_mock');
    if (!dadosSalvos) {
        localStorage.setItem('cardapio_mock', JSON.stringify(DADOS_CARDAPIO_MOCK));
    }
}

function obterCardapioLocal() {
    inicializarMockCardapio(); // Garante que foi inicializado
    const dados = localStorage.getItem('cardapio_mock');
    return JSON.parse(dados);
}

function salvarCardapioLocal(dados) {
    localStorage.setItem('cardapio_mock', JSON.stringify(dados));
}

inicializarMockCardapio();
