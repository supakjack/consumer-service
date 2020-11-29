const express = require('express')
const createError = require('http-errors')
const cors = require('cors')
const corsOptions = require('./helpers/cors_option')
require('dotenv').config({ path: '.env_development' })

const consumerRoute = require('./routers/consumer.route')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/consumer', cors(corsOptions), consumerRoute)

app.use(async (req, res, next) => {
  next(createError.NotFound())
})

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    error: {
      status: err.status || 500,
      message: err.message
    }
  })
})

const PORT = process.env.PORT || 80
const SERVER = process.env.SERVER || 'localhost'

app.listen(PORT, () => {
    console.log(`Server running on port http://${SERVER}:${PORT}`)
})