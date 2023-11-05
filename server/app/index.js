const express = require('express');
const app = express();
const port = 1337;
const cors = require('cors');
const mariaModel = require('./database_maria');
const mongodModel = require('./database_mongo');
const ObjectId = require('mongodb').ObjectId; 

app.use(cors());

app.get('/', async (req, res) => {
    res.json(['root is for comparing a "clean" route withouth db-requests'])
})

/**
 * cRud
 */
// Route /<db>/users gets all users with id, username and hash
app.get('/mariadb/users', async (req, res) => {
    const nores = req.query.nores;
    let result;

    result = await mariaModel.getData(mariaModel.queries.allUsers);

    if (nores) {
        result = []
    }

    res.json(result);
})

app.get('/mongodb/users', async (req, res) => {
    const nores = req.query.nores;
    let result;

    result = await mongodModel.getData({}, { projection: { _id: 1, username: 1, hash: 1 }});

    if (nores) {
        result = []
    }

    res.json(result);
})

// Route /<db>/usersview gets all users with id, username, hash, cardnumber, and admin/access
app.get('/mariadb/usersview', async (req, res) => {
    const nores = req.query.nores;
    let result = await mariaModel.getData(mariaModel.queries.viewUsers);

    if (nores) {
        result = []
    }

    res.json(result);
})

app.get('/mongodb/usersview', async (req, res) => {
    const nores = req.query.nores;
    let result = await mongodModel.getData({}, { projection: { _id: 1, username: 1, hash: 1, cardnr: 1, admin: 1}});

    if (nores) {
        result = []
    }

    res.json(result);
})


// Route /<db>/singleuser gets one random single user with id, username and hash
app.get('/mariadb/singleuser', async (req, res) => {
    const randomNumber = Math.floor(Math.random() * 1000);
    const result = await mariaModel.getData(mariaModel.queries.singleUser, [randomNumber]);

    res.json(result);
})

app.get('/mongodb/singleuser', async (req, res) => {
    const randomId = mongodModel.getRandomId();
    const objectId = new ObjectId(randomId)
    const result = await mongodModel.getData({_id : objectId}, { projection: { _id: 1, username: 1, hash: 1 }});

    res.json(result);
})

/**
 * crUd
 */

// Route /<db>/update/users updates a random user hash
app.get('/mariadb/update/users', async (req, res) => {
    const randomNumber = Math.floor(Math.random() * 1000);
    const result = await mariaModel.updateData(mariaModel.queries.updateUser, ["hashtest", randomNumber]);
    
    let message = "ok"

    if (result.affectedRows == 0) {
        res.status(400);
        message = "not ok";
    }

    res.send(message)
})

app.get('/mongodb/update/users', async (req, res) => {
    const randomId = mongodModel.getRandomId();
    const objectId = new ObjectId(randomId);
    const result = await mongodModel.updateData({_id : objectId}, { $set: { hash: "hashtest" } });
    let message = "ok"

    if (result.modifiedCount == 0) {
        res.status(400);
        message = "not ok";
    }

    res.send(message)
})

app.listen(port, console.log(`App is listening on port ${port}`));

