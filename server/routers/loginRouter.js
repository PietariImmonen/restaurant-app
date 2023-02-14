const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const pool = require('../database')
require('dotenv').config()

loginRouter.post('/login', async (request, response) => {
  const { email, password } = request.body
  console.log(email)
  const getQuery = `SELECT * FROM accounts WHERE email = '${email}'`
  const fromDB = await pool.query(getQuery)
  const user = fromDB.rows[0]
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.password)



  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid email or password'
    })
  }

  const userForToken = {
    firstName: user.first_name,
    lastName: user.last_name,
    phone: user.phone,
    email: user.email,
    ID: user.id,
  }

  console.log(userForToken)

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({token,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        email: user.email,
        ID: user.id })



  /*pool.query(getQuery).then((result) => {
    const passwordCorrect = result.rows[0] === null
    ? false
    : bcrypt.compare(password, result.rows[0])
    if (!(user && passwordCorrect)) {
        return response.status(401).json({
          error: 'invalid username or password'
        })
    }
    const userForToken = {
        username: user.username,
        id: user._id,
    }
    const token = jwt.sign(userForToken, process.env.SECRET)

    response
        .status(200)
        .send({ token, username: user.username, name: user.name }, console.log('Logged in!'))
    }
  )*/

  /*const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })*/
})

module.exports = loginRouter