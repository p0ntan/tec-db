const mongo = require("mongodb").MongoClient;
const dsn = "mongodb://mongodb:27017/test";
const colName = "user";

async function openDb () {
    let client;
    try {
        client  = await mongo.connect(dsn);
        const db = await client.db();

        return db;
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        return null;
    }
}

async function getData(query) {
    const db = await openDb();
    let data;

    try {
        const collection = await db.collection(colName);

        data = await collection.find(query).toArray();
    } catch (err) {
        console.error(`Error getting ${colName}:`, err);
    }

    await db.client.close();

    return data || [];
}

module.exports = {
    getData
}
