const express = require('express')

const router = express.Router()

const BABY_PLAYERS = [
    {
        id: 'p1',
        name: 'raunak',
        gamerName: 'acetone7',
        splayed: 3,
        swins: 0,
        mwins: 3
    },
    {
        id: 'p2',
        name: 'kris',
        gamerName: 'baby',
        splayed: 1,
        swins: 4,
        mwins: 3
    },
    {
        id: 'p3',
        name: 'rishika',
        gamerName: 'rish',
        splayed: 1,
        swins: 2,
        mwins: 3
    }
    
]



router.get('/:uid', (req, res, next) => {
    console.log('GET request 1 in place for users')
    const playerId = req.params.uid
    const player = BABY_PLAYERS.find(p => {
        return p.id === playerId
    })
    if(!player) {
        res.status(404).json({message: 'Player not in db'})
    }
    else{
        res.json({player: player})
    }
    next()
    
})
router.get('/', (req, res, next) => {
    console.log('GET request 1 in place for users')
    res.json(BABY_PLAYERS)
})

module.exports = router 