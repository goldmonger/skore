const express = require('express')

const router = express.Router()



router.get('/jackpot/code', (req, res, next) => {
    //console.log()
    //=======================================
    //just needs to return a json object with a unique game code
    //import a list of used codes the new code must not belong in the list
    // i wanna show the spinner wheel till this request is done on the frontend
    // find num of series played till now and increment by 1 and stringify as currentSeriesNum
    let jackCodeSalt = 'jck'
    let currentSeriesNum = '001'

    res.json({
        code: jackCodeSalt+currentSeriesNum
    })
    next()
})

router.post('/jackpot/code', (req, res, next) => {
    //console.log()
    //=======================================
    //just needs to return a json object with a unique game code
    //import a list of used codes the new code must not belong in the list
    // i wanna show the spinner wheel till this request is done on the frontend
    // find num of series played till now and increment by 1 and stringify as currentSeriesNum
    let jackCodeSalt = 'jck'
    let currentSeriesNum = '001'

    res.json({
        code: jackCodeSalt+currentSeriesNum
    })
    next()
})



router.post('/jackpot/init', (req, res, next) => {
    //console.log('GET request 1 in place for jackpot init')
    //console.log(req.body.playerNames)
    //=======================================
    // gets the player names from the dynamic list and creates a new gamestate for that list
    // and return it as json
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
    //console.log('GET request 1 in place for jackpot round')
    //console.log(req.body)
    //======================
    // gets the input values and game state skore and returns back added skores and 
    // sets 250 for out
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