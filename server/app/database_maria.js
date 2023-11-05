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


module.exports = {
    getData,
    updateData,
    queries: {
        allUsers,
        singleUser,
        viewUsers,
        updateUser
    }
}
