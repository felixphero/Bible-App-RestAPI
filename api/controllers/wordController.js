const Word = require('../Models/Word')

const mongoose = require('mongoose')

exports.words_get_all = (req, res, next) => {
    Word.find().select("word_of_the_day verse _id word_image").exec()
        .then(result => {
            const response = {
                count: result.length,
                words: result.map(result => {
                    return {
                        WordOfTheDay: result.word_of_the_day,
                        Verse: result.verse,
                        WordImage: result.word_image,
                        _id: result.id,
                        request: {
                            type: 'GET',
                            url: 'https://api-lingala.herokuapp.com/words/' + result.id
                        }
                    }
                })
            }
            if (result.length >= 0) {
                res.status(200).json(response)
            } else {
                res.status(404).json({
                    message: 'no data available'
                })
            }

        })
        .catch(err => {
            res.status(500).json({
                message: err
            })
        })
}

exports.word_post_new = (req, res, next) => {

    //create a new instance of the product
    const word = new Word({
        //pass data for the model
        _id: new mongoose.Types.ObjectId,
        word_of_the_day: req.body.WordOfTheDay,
        verse: req.body.Verse,
        word_image: req.body.WordImage

    });

    word.save().then(result => {
        console.log(result)
        res.status(201).json({
            message: 'created successfully',
            word: {
                WordOfTheDay: result.word_of_the_day,
                Verse: result.verse,
                WordImage: result.word_image,
                id: result.id,
                request: {
                    type: 'GET',
                    url: 'https://api-lingala.herokuapp.com/words/' + result.id
                }
            }

        })
    }).catch(err => {
        res.status(500).json({
            message: err
        })
    })

}

exports.get_single_word = (req, res, next) => {
    const id = req.params.wordId
    Word.findById(id).select("word_of_the_day verse _id word_image").exec()
        .then(result => {
            console.log(result)
            if (result) {
                res.status(200).json(result = {
                    WordOfTheDay: result.word_of_the_day,
                    Verse: result.verse,
                    WordImage: result.word_image,
                    id: result.id,
                    request: {
                        type: 'GET',
                        url: 'https://api-lingala.herokuapp.com/words/'
                    }
                })
            }
            else {
                res.status(404).json({
                    error: 'no valid entry found'
                })
            }

        })
        .catch(err => {
            console.log(err)
            res.status(404).json({
                error: err
            })
        })
}

exports.update_word = (req, res, next) => {
    const id = req.params.wordId
    const updateOps = {}

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }
    Word.update({ _id: id }, { $set: updateOps }).exec()
        .then(result => {
            console.log(result)
            res.status(200).json(result = {
                message: "successfully updated",
                WordOfTheDay: result.word_of_the_day,
                Verse: result.verse,
                WordImage: result.word_image,
                id: result.id,
                request: {
                    type: 'GET',
                    url: 'https://api-lingala.herokuapp.com/topics/'
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                message: err
            })
        })
}

exports.delete_word = (req, res, next) => {
    const id = req.params.id
    Word.remove({ _id: id }).exec()
        .then(result => {
            console.log(result)
            res.status(200).json({
                message: 'successfully deleted word ',
                request: {
                    type: 'GET',
                    url: 'https://api-lingala.herokuapp.com/words/'
                },
                request: {
                    type: 'POST',
                    url: 'https://api-lingala.herokuapp.com/words/',

                }
            })
        })
        .catch(err => {
            res.status(500).json({
                message: err
            })
        })
}