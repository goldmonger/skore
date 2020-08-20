const express = require('express')
const bodyParser = require('body-parser')

const usersRoutes = require('./routes/users-routes')
const gameRoutes = require('./routes/game-routes')
const app = express()

app.use(bodyParser.json())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-api-key')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
    next()
})
app.use('/players', usersRoutes)
app.use('/game', gameRoutes)

app.listen(5000)