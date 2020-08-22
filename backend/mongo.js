const MongoClient = require('mongodb').MongoClient

const url = 'mongodb+srv://skore_atlas_user:tEW9pTPEjGLSLQK@cluster0.pxdgf.mongodb.net/jackpot_test?retryWrites=true&w=majority'

const addGameRound = async (req, res, next) => {
    const newRound = {
        seriesID: req.body.seriesID,
        playing: req.body.playing,
        skores: req.body.skores,
        gameNum: req.body.gameNum
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

const addSeries = async (req, res, next) => {

}

const getAllSeries = async (req, res, next) => {

}

exports.addGameRound = addGameRound
exports.addSeries = addSeries
exports.getAllSeries = getAllSeries
