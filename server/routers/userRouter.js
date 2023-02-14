const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const pool = require('../database')

usersRouter.post('/users', async (request, response) => {
const { firstName, lastName, email, phone, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const userPostQuery = `INSERT INTO accounts (first_name, last_name, email, phone, password) 
  VALUES ('${firstName}', '${lastName}', '${email}', '${phone}', '${passwordHash}');`

  pool.query(userPostQuery).then((result) => console.log('Data Saved'))
  .catch((error) => console.log(error))

  response.send('User saved')
})

/*{
    "firstName": "Masa",
    "lastName": "GOGONE",
    "email": "m.g@gmail.com",
    "phone": "123",
    "password": "123"
}*/

module.exports = usersRouter
