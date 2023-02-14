const restaurantsRouter = require('express').Router()
const pool = require('../database')
const jwt = require('jsonwebtoken')
const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '')
    }
    return null
  }

restaurantsRouter.post('/admin/restaurants', async (request, response) => {
  const { name, address, number } = request.body
  const token = getTokenFrom(request)
  if(token === null) {
      return console.log('No token here')
  }
  const decodedToken = jwt.verify(token, process.env.SECRET, function (err, decoded) {
      if(err) err
      else return decoded
  })
    if (!decodedToken) {
      return response.status(401).json({ error: 'token invalid' })
    }


    const fromDB = await pool.query(`SELECT id FROM accounts WHERE id='${decodedToken.ID}'`)
    const ownerId = fromDB.rows[0].id

  const restaurantPostQuery = `INSERT INTO stores (owner_id, name, address, number) 
  VALUES ('${ownerId}', '${name}', '${address}', '${number}');`

  pool.query(restaurantPostQuery).then((result) => console.log('Data Saved'))
  .catch((error) => console.log(error))

  response.send('Restaurant saved')
})

restaurantsRouter.get('/admin/restaurants', async (request, response) => {
    const token = getTokenFrom(request)
    if(token === null) {
      return response.status(401).json({error: 'token invalid'})
    }
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.ID) {
      return response.status(401).json({ error: 'token invalid' })
    }

    const fromDB = await pool.query(`SELECT id FROM accounts WHERE id='${decodedToken.ID}'`)
    const ownerId = fromDB.rows[0].id
    const getQuery = `SELECT *
    FROM stores, accounts
    WHERE owner_id = ${ownerId} and accounts.id=${ownerId}`
  
    pool.query(getQuery).then((result) => response.status(200).json(result.rows))
    .catch((error) => console.log(error))
})

restaurantsRouter.get('/restaurants', (req, res) => {
  const getQuery = `SELECT * from stores`

  pool.query(getQuery).then((result) => res.status(200).json(result.rows))
  .catch((error) => console.log(error))
})

restaurantsRouter.get('/restaurants/:id', (req, res) => {
    const id = req.params.id

    const getQuery = `SELECT * FROM stores, foods WHERE stores.id=${id} AND foods.store_id=stores.id`
  
    pool.query(getQuery).then((result) => res.status(200).json(result.rows))
    .catch((error) => console.log(error))
  })

module.exports = restaurantsRouter