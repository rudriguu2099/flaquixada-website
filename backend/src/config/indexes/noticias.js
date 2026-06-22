export async function createNoticiaIndexes(db) {
  try {
    await db.collection("noticias").createIndex({ categoria: 1 });
    await db.collection("noticias").createIndex({ data: -1 });
    await db.collection("noticias").createIndex({ titulo: 1 });
    console.log("✅ Índices de notícias criados com sucesso");
  } catch (error) {
    console.error("❌ Erro ao criar índices de notícias:", error);
  }
}
