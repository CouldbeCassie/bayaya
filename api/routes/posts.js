const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.get('/', async (req, res) => {
  try {
    console.log('Attempting to load posts...');
    const posts = await Post.find();
    console.log('Posts loaded:', posts);
    res.json(posts);
  } catch (err) {
    console.error('Error loading posts:', err);
    res.status(500).json({ message: 'Failed to load posts' });
  }
});

module.exports = router;
