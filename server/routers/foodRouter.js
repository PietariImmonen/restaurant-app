const foodsRouter = require('express').Router()
const pool = require('../database')
const jwt = require('jsonwebtoken')

//Getting the token from the request
const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '')
    }
    return null
}

//Logged in user can post the foor to own restaurant
foodsRouter.post('/foods', async (request, response) => {
  //Exctracting the body
const { storeId, name, ingredients, price } = request.body

//Token
const token = getTokenFrom(request)
  if(token === null) {
      return console.log('No token here')
  }

  //Checking the token
  const decodedToken = jwt.verify(token, process.env.SECRET, function (err, decoded) {
      if(err) err
      else return decoded
  })
    if (!decodedToken) {
      return response.status(401).json({ error: 'token invalid' })
    }

    //Query to get the id from the accounts
    const fromDB = await pool.query(`SELECT id FROM accounts WHERE id='${decodedToken.ID}'`)
    const ownerId = fromDB.rows[0].id
    //Getting the store from the database with the user_id
    const storeDB = await pool.query(`SELECT id from stores WHERE owner_id='${ownerId}'`)
    const stores = storeDB.rows

    //Adding the food to the store if the user owns the store and also the storeId is correct
    if(stores.filter(i => Number(i.id) === Number(storeId)).length > 0) {

      //Query to add the food
      const foodPostQuery = `INSERT INTO foods (store_id, food_name, ingredients, price) 
        VALUES ('${storeId}', '${name}', '${ingredients}', '${price}');`

      pool.query(foodPostQuery).then((result) => console.log('Data Saved'))
      .catch((error) => response.send(error))
      return response.send('Food added')
    }
    //If the user doesn't own the restaurant return this
  response.send('Invalid restaurant')

})
//Get the food with the foods id from the database
foodsRouter.get('/foods/:id', (req, res) => {
    const id = req.params.id
    const getQuery = `SELECT *
    FROM foods
    WHERE ${id}=id`
  
    pool.query(getQuery).then((result) => res.status(200).json(result.rows))
    .catch((error) => console.log(error))
})

module.exports = foodsRouter