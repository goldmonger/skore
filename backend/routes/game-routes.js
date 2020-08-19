const express = require('express')

const router = express.Router()


router.post('/jackpot', (req, res, next) => {
    console.log('GET request 1 in place for jackpot')
    console.log(req.body.playerNames)
    const gameState = []
    req.body.playerNames.map((playerName, index) => {
        const playerData = {
            name: playerName,
            id: 'j' + index,
            skore: 0
        }
        gameState.push(playerData)
    })
    res.json(gameState)
    next()
})
router.post('/jackpot/round', (req, res, next) => {
    console.log('GET request 1 in place for jackpot round')
    next()
})

module.exports = router 