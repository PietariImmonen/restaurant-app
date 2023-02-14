const restaurantsRouter = require('express').Router()
const pool = require('../database')
const jwt = require('jsonwebtoken')

//Helper function to exctract the token from the request
const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '')
    }
    return null
  }
//Function for logged in users to post a restaurant to their system
restaurantsRouter.post('/admin/restaurants', async (request, response) => {
    //Extracting items from request
  const { name, address, number } = request.body
  //Get the token from request
  const token = getTokenFrom(request)
  if(token === null) {
      return console.log('No token here')
  }
  //Verify the token with JsonWebToken verify
  const decodedToken = jwt.verify(token, process.env.SECRET, function (err, decoded) {
      if(err) err
      else return decoded
  })
    if (!decodedToken) {
      return response.status(401).json({ error: 'token invalid' })
    }

    //Getting the id from database with the logged in user
    const fromDB = await pool.query(`SELECT id FROM accounts WHERE id='${decodedToken.ID}'`)
    const ownerId = fromDB.rows[0].id
    //Posting the restaurant to the database with the owner_id
  const restaurantPostQuery = `INSERT INTO stores (owner_id, name, address, number) 
  VALUES ('${ownerId}', '${name}', '${address}', '${number}');`

  pool.query(restaurantPostQuery).then((result) => response.send('Restaurant saved'))
  .catch((error) => response.send(error))

  response.send('Restaurant saved')
})

//Logged in user can get the restaurant from the system
restaurantsRouter.get('/admin/restaurants', async (request, response) => {
    //Getting the token
    const token = getTokenFrom(request)
    if(token === null) {
      return response.status(401).json({error: 'token invalid'})
    }
    //Checking the token
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.ID) {
      return response.status(401).json({ error: 'token invalid' })
    }
    //Getting the user id from the database
    const fromDB = await pool.query(`SELECT id FROM accounts WHERE id='${decodedToken.ID}'`)
    const ownerId = fromDB.rows[0].id

    //Selecting the restaurants and accounts from the database
    const getQuery = `SELECT *
    FROM stores, accounts
    WHERE owner_id = ${ownerId} and accounts.id=${ownerId}`
  
    pool.query(getQuery).then((result) => response.status(200).json(result.rows))
    .catch((error) => console.log(error))
})

//Non-logged in users to get the data from the database
restaurantsRouter.get('/restaurants', (req, res) => {
  const getQuery = `SELECT * from stores`

  //Selecting stores from the database
  pool.query(getQuery).then((result) => res.status(200).json(result.rows))
  .catch((error) => console.log(error))
})

//Get the specifid restaurant from the database Non-logged in
restaurantsRouter.get('/restaurants/:id', (req, res) => {
    //Get the id from the params
    const id = req.params.id
    //Query to get the data from database
    const getQuery = `SELECT * FROM stores, foods WHERE stores.id=${id} AND foods.store_id=stores.id`
  
    pool.query(getQuery).then((result) => res.status(200).json(result.rows))
    .catch((error) => console.log(error))
  })

module.exports = restaurantsRouter