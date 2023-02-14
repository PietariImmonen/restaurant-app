const {Pool} = require("pg")

const pool = new Pool({
    user: "postgres",
    password: 'opqrstu12',
    host: 'localhost',
    port: '5432',
    database: 'restaurant_system'
})

/*const tableQuery = `CREATE TABLE foods (
    ID serial PRIMARY KEY,
    store_id INTEGER,
    name TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    price INTEGER NOT NULL
    );`

const alterQuery = `ALTER TABLE foods
RENAME COLUMN name to food_name`

const alter = `ALTER TABLE stores ADD COLUMN owner_id INTEGER`

pool.query(alterQuery).then((res) => {
    console.log('table created')
    console.log(res)
}).catch((error) => console.log(error))*/

module.exports = pool