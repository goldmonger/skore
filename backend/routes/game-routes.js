const express = require('express')

const mongof = require('../mongo')

const router = express.Router()




router.get('/jackpot/code',async (req, res, next) => {
    //console.log()
    //=======================================
    //just needs to return a json object with a unique game code
    //import a list of used codes the new code must not belong in the list
    // i wanna show the spinner wheel till this request is done on the frontend
    // find num of series played till now and increment by 1 and stringify as currentSeriesNum
    let jackCodeSalt = 'jck'
    let coun = await mongof.getAllSeries()
    //console.log(typeof coun)
    coun += 1
    coun = coun.toString()
    //console.log(typeof coun)
    //console.log(coun)
    let currentSeriesNum = coun

    res.json({
        code: jackCodeSalt+currentSeriesNum
    })
    next()
})


router.post('/jackpot/init', (req, res, next) => {
    //=======================================
    // gets the playerNames, stakes, seriesID from the dynamic list
    // and creates a new gamestate object for that list
    // adds the req body into collection jackpot_series
    // and return it
    mongof.addSeries(req.body.playerNames, req.body.stakes, req.body.seriesID)
    
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
    // each submit lets breakdown the tasks to be done
    // total the skores
    // check the state for outs
    // send the game state and out separately
    // calc the dealer from playing array instead of whole game state
    let newPlaying = []
    let newPlayerIds = []
    let out_list = []
    let updatedSkores = []
    for (let x=0; x< req.body.curSkores.length; x++){
        if(parseInt(req.body.skores[x]) + parseInt(req.body.curSkores[x]) >= 250){
            //updatedSkores.push(250)
            out_list.push(req.body.playerNames[x])
        }
        else{
            newPlaying.push(req.body.playerNames[x])
            newPlayerIds.push(req.body.playerIds[x])
            updatedSkores.push(parseInt(req.body.skores[x]) + parseInt(req.body.curSkores[x]))
        }
    }
    let newJsonObj = {
        playerNames: newPlaying,
        playerIds: newPlayerIds,
        skores: updatedSkores,
        outs: out_list
    }
    res.json(newJsonObj)
    next()
})

module.exports = router 