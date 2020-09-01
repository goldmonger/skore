const express = require('express')

const mongof = require('../mongo')

const router = express.Router()


// SS7 ROUTES
router.get('/ss7/code',async (req, res, next) => {
    //console.log()
    //=======================================
    //just needs to return a json object with a unique game code
    //import a list of used codes the new code must not belong in the list
    // i wanna show the spinner wheel till this request is done on the frontend
    // find num of series played till now and increment by 1 and stringify as currentSeriesNum
    let ss7CodeSalt = 'ss7'
    let coun = await mongof.getAllSeriesSs7()
    //console.log(typeof coun)
    coun += 1
    coun = coun.toString()
    //console.log(typeof coun)
    //console.log(coun)
    let currentSeriesNum = coun

    res.json({
        code: ss7CodeSalt+currentSeriesNum
    })
    next()
})


router.post('/ss7/init', (req, res, next) => {
    //=======================================
    // gets the playerNames, stakes, seriesID from the dynamic list
    // and creates a new gamestate object for that list
    // adds the req body into collection jackpot_series
    // and return it
    mongof.addSeriesSs7(req.body.selected, req.body.stakes, req.body.seriesID)

    let gameObj = {
        gameState: []
    }
    req.body.selected.map((playerName, index) => {
        const playerData = {
            name: playerName,
            id: 'j' + index,
            skore: 0
        }
        gameObj.gameState.push(playerData)
    })
    res.json(gameObj)
    next()
})



router.post('/ss7/round', (req, res, next) => {

    let updatedSkores = []
    let newGameState = []
    if(req.body.gameRound === 1 || req.body.gameRound === 7){
        for (let x=0; x< req.body.curSkores.length; x++){
            let old = parseInt(req.body.skores[x])
            let neo = parseInt(req.body.curSkores[x])
            neo = 2*neo
            //console.log(neo)
            //console.log(old)
            let total = old + neo
            updatedSkores.push(total)
            //console.log(total)
        }
    }
    else{
        for (let x=0; x< req.body.curSkores.length; x++){
            let old = parseInt(req.body.skores[x])
            let neo = parseInt(req.body.curSkores[x])
            //console.log(neo)
            //console.log(old)
            let total = old + neo
            updatedSkores.push(total)
            //console.log(total)
        }
    }
    //console.log(req.body.curSkores)
    //console.log(req.body.skores)
    //console.log(updatedSkores)
    
    for (let x=0; x< req.body.playing.length; x++){
        let gameStatePlayer = {
            name: req.body.playing[x],
            id: req.body.playerIds[x],
            skore: updatedSkores[x]

        }
        newGameState.push(gameStatePlayer)
    }
    let newJsonObj = {
        playerNames: req.body.playing,
        playerIds: req.body.playerIds,
        skores: updatedSkores,
        gameState: newGameState
    }
    mongof.addGameRoundSs7(req.body.seriesID, req.body.playing, updatedSkores, req.body.gameRound, req.body.dealer)
    res.json(newJsonObj)
    next()
})







// JACKPOT ROUTES
// ==============
router.get('/jackpot/code',async (req, res, next) => {
    //console.log()
    //=======================================
    //just needs to return a json object with a unique game code
    //import a list of used codes the new code must not belong in the list
    // i wanna show the spinner wheel till this request is done on the frontend
    // find num of series played till now and increment by 1 and stringify as currentSeriesNum
    let jackCodeSalt = 'jck'
    let coun = await mongof.getAllSeriesJack()
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
    mongof.addSeriesJack(req.body.playerNames, req.body.stakes, req.body.seriesID)

    let openerIndexFirst = req.body.playerNames.findIndex(p => {
        return p === req.body.dealer
    })
    if(openerIndexFirst < req.body.playerNames.length-1){
        openerIndexFirst += 1
    }
    else{
        openerIndexFirst = 0
    }
    const openerFirst = req.body.playerNames[openerIndexFirst]

    let gameObj = {
        gameState: [],
        opener: openerFirst
    }
    //let gameState = []
    req.body.playerNames.map((playerName, index) => {
        const playerData = {
            name: playerName,
            id: 'j' + index,
            skore: 0
        }
        gameObj.gameState.push(playerData)
    })
    res.json(gameObj)
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
    mongof.addGameRoundJack(req.body.seriesID, newPlaying, updatedSkores, req.body.round, req.body.dealer, req.body.opener)
    res.json(newJsonObj)
    next()
})

module.exports = router 