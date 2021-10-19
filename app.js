const express = require('express')
const http = require('http')
const cors = require('cors')
const path = require('path')
const createHttpError = require('http-errors')
const mongoose = require('mongoose')
const authrouter = require('./routes/auth')
const { passport } = require('./utils/authenticate')
require('dotenv').config()

const app = express()
const server = http.createServer(app)
const corsOptions = {
  origin: process.env.ORIGIN,
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))
/* the documentation says if we use the above way for cors we don't need to write the below line but i was getting cors error */
app.options('*', cors(corsOptions))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
/* set Content-Type header so that no need to set this header for each response */
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  next()
})
/* for intializing passport. use this before any other routes */
app.use(passport.initialize())
app.use('/', authrouter)
/* catch 404 and forward to error handler */
app.use(function (req, res, next) {
  next(createHttpError(404))
})
/* error handler */
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.json({ success: false, message: err.message })
})
const url = process.env.MONGODB_URL
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}
mongoose.connect(url, dbOptions).then(
  (db) => {
    console.log('Connected to server')
  },
  (err) => {
    console.log(err)
  }
)
const port = process.env.PORT || 3000
server.listen(port, () => {
  console.log(`listening on ${port}`)
})
