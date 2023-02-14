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
//Using different routers for different end-points
app.use(usersRouter)
app.use(restaurantsRouter)
app.use(foodsRouter)
app.use(loginRouter)



const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})