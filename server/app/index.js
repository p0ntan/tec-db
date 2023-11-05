const express = require('express');
const app = express();
const port = 1337;
const cors = require('cors');
const mariaModel = require('./database_maria');
const mongodModel = require('./database_mongo');


app.use(cors());

app.get('/', async (req, res) => {
    res.json(['root is for comparing a "clean" route withouth db-requests'])
})

/**
 * cRud
 */
app.get('/users', async (req, res) => {
    const nores = req.query.nores;
    const mongo = req.query.mongo;
    let result;

    if (!mongo) {
        result = await mariaModel.getData(mariaModel.queries.allUsers);
    } else {
        result = await mongodModel.getData({}, { projection: { _id: 1, username: 1, hash: 1 }});
    }

    if (nores) {
        result = []
    }

    res.json(result);
})

app.get('/usersview', async (req, res) => {
    const nores = req.query.nores;
    let result = await mariaModel.getData(mariaModel.queries.viewUsers);

    if (nores) {
        result = []
    }

    res.json(result);
})

app.get('/users/:id', async (req, res) => {
    const id = req.params.id;
    const result = await mariaModel.getData(mariaModel.queries.singleUser, [id]);

    res.json(result);
})

/**
 * crUd
 */
app.get('/update/users', async (req, res) => {
    const randomNumber = Math.floor(Math.random() * 1000);
    const result = await mariaModel.updateData(mariaModel.queries.updateUser, ["hashtest", randomNumber]);
    
    let message = "ok"

    if (result.affectedRows == 0) {
        res.status(400);
        message = "not ok";
    }

    res.send(message)
})

app.listen(port, console.log(`App is listening on port ${port}`));

