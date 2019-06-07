const express = require('express');
const router = express.Router();
const SermonContoller = require('../controllers/sermonController')



router.get('/', SermonContoller.get_all_sermons)
router.post('/', SermonContoller.post_new_sermon)
router.get('/:DailyWord', SermonContoller.get_single_sermon)
router.delete('/:id', SermonContoller.delete_sermon)

module.exports = router