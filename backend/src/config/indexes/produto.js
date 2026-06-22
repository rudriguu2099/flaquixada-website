export const createProdutoIndexes = async (db) => {
  try {
    const colecao = db.collection("produtos");

    await colecao.createIndex({ nome: 1 }, { unique: true });

    await colecao.createIndex(
      { nome: "text", descricao: "text" },
      { name: "BuscaTextoProdutos", default_language: "portuguese" },
    );

    console.log("✅ Índices de produtos criados");
  } catch (error) {
    console.error("❌ Erro ao criar índices de produtos:", error.message);
  }
};
