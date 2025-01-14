async function createPost(postData) {
    try {
      const response = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      const result = await response.json();
      if (response.ok) {
        console.log('Post created:', result);
      } else {
        console.error('Failed to create post:', result);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  