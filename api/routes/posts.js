const express = require('express');
const router = express.Router();

let posts = [];

router.get('/', (req, res) => {
  try {
    res.json(posts);
  } catch (err) {
    console.error('Error loading posts:', err);
    res.status(500).json({ message: 'Failed to load posts' });
  }
});

router.post('/', (req, res) => {
  try {
    const { username, content } = req.body;
    const newPost = { username, content, timestamp: new Date().toISOString(), _id: Date.now().toString(), likes: 0, dislikes: 0 };
    posts.push(newPost);
    res.status(201).json({ message: 'Post created!', post: newPost });
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ message: 'Failed to create post' });
  }
});

router.patch('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;
    const post = posts.find(post => post._id === id);
    if (post) {
      if (action === 'like') {
        post.likes = post.likes || 0;
        post.likes += 1;
      } else if (action === 'dislike') {
        post.dislikes = post.dislikes || 0;
        post.dislikes += 1;
      }
      res.status(200).json({ message: 'Post updated!', post });
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({ message: 'Failed to update post' });
  }
});

module.exports = router;
