const express = require('express')
const bodyParser = require('body-parser')

const usersRoutes = require('./routes/users-routes')
const app = express()

app.use('/players', usersRoutes)

app.listen(5000)