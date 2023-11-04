const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'mariadb',
    user: 'root',
    database: 'test',
    // connectionLimit: 5
});

const allUsers = "SELECT * FROM user;";
const singleUser = "SELECT * FROM user WHERE id = ?;" 

async function mariaDbGetData(sqlQuery, args=[]) {
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
    mariaDbGetData,
    queries: {
        allUsers,
        singleUser
    }
}
