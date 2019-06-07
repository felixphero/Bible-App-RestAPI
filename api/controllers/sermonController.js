const Sermon = require('../Models/Sermon')
const mongoose = require('mongoose')
const Word = require('../Models/Word')

exports.get_all_sermons = (req, res, next) => {
    Sermon.find()
        .select('sermon_topic sermon_explanation daily_word')
        .exec()
        .then(result => {
            res.status(200).json({
                count: result.length,
                sermons: result.map(
                    result => {
                        return {
                            result: result,
                            request: {
                                type: 'GET',
                                url: 'https://api-lingala.herokuapp.com/sermons/' + result._id
                            }
                        }
                    }
                ),

            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.post_new_sermon = (req, res, next) => {
    Word.findById(req.body.DailyWord)
        .then(word => {
            if (!word) {
                return res.status(404).json({
                    message: "Word not found"
                })
            }
            const subject = new Sermon({
                _id: new mongoose.Types.ObjectId(),
                sermon_topic: req.body.SermonTopic,
                sermon_explanation: req.body.SermonExplanation,
                daily_word: req.body.DailyWord
            })
            return subject.save()
                .then(result => {
                    res.status(201).json({
                        message: 'sermon successfully added',
                        details: result,
                        request: {
                            type: 'GET',
                            url: 'https://api-lingala.herokuapp.com/sermons/' + result._id
                        }
                    })
                })
                .catch(err => {
                    res.status(500).json(
                        {
                            message: 'Sermon not found',
                            error: err
                        }
                    )
                })

        }
        )

}

exports.get_single_sermon = (req, res, next) => {
    const DailyWord = req.params.DailyWord
    Sermon.find({ daily_word: DailyWord })
        .select('sermon_topic sermon_explanation daily_word')
        .exec()
        .then(sermons => {
            if (!sermons) {
                return res.status(404).json({
                    message: 'Subject not found'
                })
            }
            res.status(200).json({
                sermons,
                request: {
                    type: 'GET',
                    url: 'https://api-lingala.herokuapp.com/subjects'
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                message: err
            })
        })
}

exports.delete_sermon = (req, res, next) => {
    const id = req.params.id
    Sermon.remove({ _id: id }).exec()
        .then(result => {

            res.status(200).json({
                message: 'sermon deleted successfully',
                request: {
                    type: 'POST',
                    url: 'https://api-lingala.herokuapp.com/sermons',


                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}