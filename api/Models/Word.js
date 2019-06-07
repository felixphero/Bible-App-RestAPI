const mongoose = require('mongoose')
//to store data in the db you nedd a model

//create a schema
const wordSchema = mongoose.Schema({
    //define howyour product will look like
    _id: mongoose.Schema.Types.ObjectId,
    word_of_the_day: {
        type: String, required: true
    },
    verse: {
        type: String, required: true
    },
    word_image: {
        type: String, required: true
    }

});

//export the schema wrapped in a model
module.exports = mongoose.model('Word', wordSchema)
