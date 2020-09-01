const MongoClient = require('mongodb').MongoClient

const url = 'mongodb+srv://skore_atlas_user:tEW9pTPEjGLSLQK@cluster0.pxdgf.mongodb.net/jackpot_test?retryWrites=true&w=majority'


// SS7 MONGO FUNCTIONS 

const getAllSeriesSs7 = async () => {
    const client = new MongoClient(url)
    try {
        await client.connect()
        const db = client.db()
        const result = db.collection('ss7_series').estimatedDocumentCount({})
        return (result)
    } catch(error) {
        return res.json({message: "Could not fetch series!"})
    }
    client.close()
}

const addSeriesSs7 = async (playerNames, stakes, seriesID) => {
    const newSeries = {
        playerNames: playerNames,
        stakes: stakes,
        seriesID: seriesID
    }
    const client = new MongoClient(url)

    try {
        await client.connect()
        const db = client.db()
        const result = db.collection('ss7_series').insertOne(newSeries)
    } catch(error) {
        return res.json({message: "Could not store series!"})
    }
    client.close()
}


const addGameRoundSs7 = async (seriesID, playing, skores, gameNum, dealer) => {
    const newRound = {
        seriesID: seriesID,
        playing: playing,
        skores: skores,
        gameNum: gameNum,
        dealer: dealer
    }
    const client = new MongoClient(url)

    try {
        await client.connect()
        const db = client.db()
        const result = db.collection('ss7_rounds').insertOne(newRound)
    } catch(error) {
        return res.json({message: "Could not store data!"})
    }
    client.close()
}




// JACKPOT MONGO FUNCTIONS
const addGameRoundJack = async (seriesID, playing, skores, gameNum, dealer, opener) => {
    const newRound = {
        seriesID: seriesID,
        playing: playing,
        skores: skores,
        gameNum: gameNum,
        dealer: dealer,
        opener: opener
    }
    const client = new MongoClient(url)

    try {
        await client.connect()
        const db = client.db()
        const result = db.collection('jackpot_rounds').insertOne(newRound)
    } catch(error) {
        return res.json({message: "Could not store data!"})
    }
    client.close()
}

const addSeriesJack = async (playerNames, stakes, seriesID) => {
    const newSeries = {
        playerNames: playerNames,
        stakes: stakes,
        seriesID: seriesID
    }
    const client = new MongoClient(url)

    try {
        await client.connect()
        const db = client.db()
        const result = db.collection('jackpot_series').insertOne(newSeries)
    } catch(error) {
        return res.json({message: "Could not store series!"})
    }
    client.close()
}

const getAllSeriesJack = async () => {
    const client = new MongoClient(url)
    try {
        await client.connect()
        const db = client.db()
        const result = db.collection('jackpot_series').estimatedDocumentCount({})
        return (result)
    } catch(error) {
        return res.json({message: "Could not fetch series!"})
    }
    client.close()
}

exports.addGameRoundJack = addGameRoundJack
exports.addSeriesJack = addSeriesJack
exports.getAllSeriesJack = getAllSeriesJack

exports.getAllSeriesSs7 = getAllSeriesSs7
exports.addSeriesSs7 = addSeriesSs7
exports.addGameRoundSs7 = addGameRoundSs7