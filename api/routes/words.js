const express = require('express')
const router = express.Router()
const wordController = require('../controllers/wordController')


router.get('/', wordController.words_get_all)

router.post('/', wordController.word_post_new)

router.get('/:wordId', wordController.get_single_word)

// router.patch('/:wordId', wordController.update_word)

router.delete('/:id', wordController.delete_word)

module.exports = router;