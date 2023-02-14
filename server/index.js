const express = require('express')
const cors = require('cors')
const app = express()
const pool = require('./database')
const usersRouter = require('./routers/userRouter')
const restaurantsRouter = require('./routers/restaurantRouter')
const foodsRouter = require('./routers/foodRouter')
const loginRouter = require('./routers/loginRouter')
const logger = require('./middlewares/logger')

app.use(express.json())
app.use(cors())

app.use(usersRouter)
app.use(restaurantsRouter)
app.use(foodsRouter)
app.use(loginRouter)


app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

/*app.get('/api/messages', (req, res) => {
  const getQuery = `SELECT * from messages`

  pool.query(getQuery).then((result) => res.status(200).json(result.rows))
  .catch((error) => console.log(error))
})

app.get('/api/messages/:id', (req, res) => {
  const id = req.params.id
  const getQuery = `SELECT * FROM messages WHERE user_id = ${id}`

  pool.query(getQuery).then((result) => res.status(200).json(result.rows))
  .catch((error) => console.log(error))
})

app.post('/api/messages', (req, res) => {
  const name = req.body['name']
  const message = req.body['message']

  console.log(name, message)

  const postQuery = `INSERT INTO messages (name, message) VALUES ('${name}', '${message}');`

  pool.query(postQuery).then((result) => console.log('Data Saved'))
  .catch((error) => console.log(error))

  res.send('Moi')
})

app.delete('/api/messages/:id', (req, res) => {

  const id = req.params.id

  const delQuery = `DELETE FROM messages WHERE user_id = ${id}`

  pool.query(delQuery).then((result) => console.log('Data deleted'))
  .catch((error) => console.log(error))
  res.send('Deleted')
})

app.put('/api/messages/:id', (req, res) => {
  const message = req.body['message']

  const id = req.params.id

  const delQuery = `UPDATE messages SET message = '${message}' WHERE user_id = ${id}`

  pool.query(delQuery).then((result) => console.log('Data changed'))
  .catch((error) => console.log(error))
  res.send('Changed')
})*/

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})