export async function createCardapioIndexes(db) {
  try {
    await db.collection("cardapios").createIndex({ categoria: 1 });
    await db.collection("cardapios").createIndex({ ativo: 1 });
    await db.collection("cardapios").createIndex({ nome: 1 });
    console.log("✅ Índices de cardápios criados com sucesso");
  } catch (error) {
    console.error("❌ Erro ao criar índices de cardápios:", error);
  }
}
