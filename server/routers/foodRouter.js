const foodsRouter = require('express').Router()
const pool = require('../database')
const jwt = require('jsonwebtoken')
const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '')
    }
    return null
}

foodsRouter.post('/foods', async (request, response) => {
const { storeId, name, ingredients, price } = request.body

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

    const storeDB = await pool.query(`SELECT id from stores WHERE owner_id='${ownerId}'`)
    const stores = storeDB.rows
    if(stores.filter(i => Number(i.id) === Number(storeId)).length > 0) {
      const foodPostQuery = `INSERT INTO foods (store_id, food_name, ingredients, price) 
        VALUES ('${storeId}', '${name}', '${ingredients}', '${price}');`

      pool.query(foodPostQuery).then((result) => console.log('Data Saved'))
      .catch((error) => response.send(error))
      return response.send('Food added')
    }

  response.send('Invalid restaurant')

})

foodsRouter.get('/foods/restaurants/:id', (req, res) => {
    const id = req.params.id
    const getQuery = `SELECT foods.food_name 
    FROM foods, accounts, stores 
    WHERE ${id}=stores.owner_id AND stores.id = foods.store_id`
  
    pool.query(getQuery).then((result) => res.status(200).json(result.rows))
    .catch((error) => console.log(error))
})

module.exports = foodsRouter