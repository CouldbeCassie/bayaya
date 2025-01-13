const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');

router.post('/', postsController.createPost);
router.get('/', postsController.getAllPosts);
router.patch('/:id', postsController.updatePost);

module.exports = router;
