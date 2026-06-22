export const createUserIndexes = async (db) => {
    await db.collection("users").createIndex({ email: 1 }, { unique: true });
}