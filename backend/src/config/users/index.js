export const createUserIndexes = async () => {
    await db.collection("users").createIndex({ email: 1 }, { unique: true });
}