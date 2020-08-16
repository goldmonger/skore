const express = require('express')

const router = express.Router()

router.get('/', (req, res, next) => {
    console.log('GET request 1 in place for users')
    res.json({
        user1: 'acetone7', 
        user2: 'babykris',
        user3: 'baby'
})
})

module.exports = router 