const mongo = require("mongodb").MongoClient;
const dsn = "mongodb://mongodb:27017/test";
const jsonData = require('./mock_db.users.json');

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

async function getData(colName, query, options) {
    const db = await openDb();
    let data;

    try {
        const collection = await db.collection(colName);

        data = await collection.find(query, options).toArray();
    } catch (err) {
        console.error(`Error getting ${colName}:`, err);
    }

    await db.client.close();

    return data || [];
}

async function updateData(colName, query, options) {
    const db = await openDb();
    let data;

    try {
        const collection = await db.collection(colName);

        data = await collection.updateOne(query, options);
    } catch (err) {
        console.error(`Error updating ${colName}:`, err);
    }

    await db.client.close();

    return data;
}

async function createData(colName, doc) {
    const db = await openDb();
    let data;

    try {
        const collection = await db.collection(colName);

        data = await collection.insertOne(doc);
    } catch (err) {
        console.error(`Error creating in ${colName}:`, err);
    }

    await db.client.close();

    return data;
}

function getRandomId() {
    const numberOfUsers = jsonData.length;
    const randomNumber = Math.floor(Math.random() * numberOfUsers);

    return jsonData[randomNumber]._id.$oid;
}

module.exports = {
    getData,
    updateData,
    getRandomId,
    createData
}
