exports.createPost = (req, res) => {
  const { content, username } = req.body;
  const newPost = { username, content, timestamp: new Date().toISOString(), _id: Date.now().toString(), likes: 0, dislikes: 0 };
  console.log("Post created:", newPost);

  if (!global.posts) global.posts = [];
  global.posts.push(newPost);

  res.status(201).send({ message: 'Post created!', post: newPost });
};

exports.getAllPosts = (req, res) => {
  const posts = global.posts || [];
  res.status(200).send(posts);
};

exports.updatePost = (req, res) => {
  const { id } = req.params;
  const { action } = req.body;
  console.log(`Updating post ${id} with action ${action}`);

  const post = global.posts.find(post => post._id === id);
  if (post) {
      if (action === 'like') {
          post.likes += 1;
      } else if (action === 'dislike') {
          post.dislikes += 1;
      }
      res.status(200).send({ message: 'Post updated!', post });
  } else {
      res.status(404).send({ message: 'Post not found' });
  }
};
