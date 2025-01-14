const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');  // Corrected path

router.post('/', postController.createPost);
router.get('/', postController.getAllPosts);
router.patch('/:id', postController.updatePost);

module.exports = router;
