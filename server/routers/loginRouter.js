const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const pool = require('../database')
require('dotenv').config()
//Loginrouter made for logging in the system and creating the JSON webtoken
loginRouter.post('/login', async (request, response) => {
    //Extracting the body
  const { email, password } = request.body
  console.log(email)
  //Making the query to get the user with email
  const getQuery = `SELECT * FROM accounts WHERE email = '${email}'`
  const fromDB = await pool.query(getQuery)
  //Get the user information
  const user = fromDB.rows[0]
  //Compare the passwordhash from the database to written password
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.password)

//Error message
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid email or password'
    })
  }
//The object for the token
  const userForToken = {
    firstName: user.first_name,
    lastName: user.last_name,
    phone: user.phone,
    email: user.email,
    ID: user.id,
  }
  //Creating the token
  const token = jwt.sign(userForToken, process.env.SECRET)
  //Sending the response to the user
  response
    .status(200)
    .send({token,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        email: user.email,
        ID: user.id })
})

module.exports = loginRouter