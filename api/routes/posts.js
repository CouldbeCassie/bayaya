const express = require('express');
const router = express.Router();

let posts = [];

// Route to get all posts
router.get('/', (req, res) => {
  try {
    console.log('Attempting to load posts...');
    res.json(posts);
  } catch (err) {
    console.error('Error loading posts:', err);
    res.status(500).json({ message: 'Failed to load posts' });
  }
});

// Route to create a new post
router.post('/', (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = { id: posts.length + 1, title, content };
    posts.push(newPost);
    res.status(201).json(newPost);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ message: 'Failed to create post' });
  }
});

module.exports = router;
