const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'mariadb',
    user: 'root',
    database: 'test',
    // connectionLimit: 5
});

const allUsers = "SELECT * FROM user;";
const viewUsers = "SELECT * FROM v_user;";
const singleUser = "SELECT * FROM user WHERE id = ?;" 
const updateUser = "UPDATE user SET hash = ? WHERE id = ?;"
const createMediumtext = "insert into trip_mediumtext (geojson) VALUES (?);"
const createText = "insert into trip_text (geojson) VALUES (?);"
const createVarchar = "insert into trip_varchar (geojson) VALUES (?);"
const getVarchar = "SELECT * FROM trip_varchar WHERE id = ?;"
const getText = "SELECT * FROM trip_text WHERE id = ?;"
const getMediumtext = "SELECT * FROM trip_mediumtext WHERE id = ?;"

async function getData(sqlQuery, args=[]) {
    let conn;

    try {
        conn = await pool.getConnection();
        const res = await conn.query(sqlQuery, args);

        return res;
  
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

async function updateData(sqlQuery, args=[]) {
    let conn;

    try {
        conn = await pool.getConnection();
        const res = await conn.query(sqlQuery, args);

        return res;
  
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

async function createData(sqlQuery, args=[]) {
    let conn;

    try {
        conn = await pool.getConnection();
        const res = await conn.query(sqlQuery, args);

        return res;
  
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

module.exports = {
    getData,
    updateData,
    createData,
    queries: {
        allUsers,
        singleUser,
        viewUsers,
        updateUser,
        createMediumtext,
        createText,
        getMediumtext,
        getText,
        createVarchar,
        getVarchar
    }
}
