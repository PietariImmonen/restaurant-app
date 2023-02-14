const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const pool = require('../database')
//Router made for creating a user to database using bcrypt algorithm
usersRouter.post('/users', async (request, response) => {
const { firstName, lastName, email, phone, password } = request.body

  const saltRounds = 10
  //Making passwordhash to password with bcrypt
  const passwordHash = await bcrypt.hash(password, saltRounds)
  //The query to create the account to database
  const userPostQuery = `INSERT INTO accounts (first_name, last_name, email, phone, password) 
  VALUES ('${firstName}', '${lastName}', '${email}', '${phone}', '${passwordHash}');`
  //Query
  pool.query(userPostQuery).then((result) => response.send('Data Saved'))
  .catch((error) => response.send(error))
})

/*{
    "firstName": "Masa",
    "lastName": "GOGONE",
    "email": "m.g@gmail.com",
    "phone": "123",
    "password": "123"
}*/

module.exports = usersRouter
