const mongoose = require('mongoose')
//in this model we created a relationship with the Product Model in order to work it out
const sermonSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    daily_word: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Word'
    },
    sermon_topic: {
        type: String,
        required: true
    },
    sermon_explanation: {
        type: String,
        required: true
    }


})

module.exports = mongoose.model('Sermon', sermonSchema)