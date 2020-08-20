const express = require('express')

const router = express.Router()


router.post('/jackpot/init', (req, res, next) => {
    console.log('GET request 1 in place for jackpot init')
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
    console.log(req.body)
    let updatedSkores = []
    for (let x=0; x< req.body.curSkores.length; x++){
        if(parseInt(req.body.skores[x]) + parseInt(req.body.curSkores[x]) >= 250){
            updatedSkores.push(250)
        }
        else{
            updatedSkores.push(parseInt(req.body.skores[x]) + parseInt(req.body.curSkores[x]))
        }
    }
    let newJsonObj = {
        playerNames: req.body.playerNames,
        playerIds: req.body.playerIds,
        skores: updatedSkores
    }
    res.json(newJsonObj)
    next()
})

module.exports = router 