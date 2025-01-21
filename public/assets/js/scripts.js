document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('currentUser')) {
        showForum();
    } else {
        showLogin();
    }

    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        login(username, password);
    });

    document.getElementById('signupForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('signupUsername').value;
        const password = document.getElementById('signupPassword').value;
        signup(username, password);
    });

    document.getElementById('showSignup').addEventListener('click', (e) => {
        e.preventDefault();
        showSignup();
    });

    document.getElementById('showLogin').addEventListener('click', (e) => {
        e.preventDefault();
        showLogin();
    });

    document.getElementById('postForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const category = document.getElementById('category').value;
        const author = localStorage.getItem('currentUser');

        const newPost = {
            title,
            content,
            category,
            author,
            date: new Date().toISOString(),
            comments: []
        };

        fetch('http://192.168.1.118:3000/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPost),
        })
        .then(response => response.json())
        .then(() => {
            fetchPosts();
            document.getElementById('postForm').reset();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    document.getElementById('logout').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        showLogin();
    });

    document.getElementById('filterCategory').addEventListener('change', fetchPosts);

    fetchPosts();
});

function fetchPosts() {
    fetch('http://192.168.1.118:3000/posts')
    .then(response => response.json())
    .then(posts => {
        const selectedCategory = document.getElementById('filterCategory').value;
        const postsContainer = document.getElementById('posts');
        postsContainer.innerHTML = '';

        const filteredPosts = selectedCategory === 'All' ? posts : posts.filter(post => post.category === selectedCategory);

        filteredPosts.forEach((post, postIndex) => {
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.innerHTML = `
                <div>
                    <p><strong class="title">${post.title}</strong>. <small class="date">${new Date(post.date).toLocaleString()}</small></p>
                    <p>Category: <strong>${post.category}</strong></p>
                </div>
                <hr>
                <h3><strong>${post.author}:</strong></h3>
                <div class="content">
                    <p>${post.content}</p>
                </div>
                <hr>
                <div class="comments">
                    <form class="commentForm" data-post-index="${postIndex}">
                        <input type="text" class="commentInput" placeholder="Add a comment" required autocomplete="off">
                        <button type="submit">Comment</button>
                    </form>
                    <button class="toggleComments" aria-expanded="false" style="display: ${post.comments.length > 0 ? 'block' : 'none'};">Show Comments</button>
                    <div class="comments-content" style="display: none;">
                        ${post.comments.map((comment, commentIndex) => `
                            <hr>
                            <div class="comment">
                                <small class="date">${new Date(comment.date).toLocaleString()}</small>
                                <p><strong>${comment.author}</strong>: ${comment.content}</p>
                                ${comment.replies && comment.replies.length > 0 ? `
                                    <button class="toggleReplies" aria-expanded="false">Show Replies</button>
                                    <div class="replies" style="display: none;">
                                        ${comment.replies.map(reply => `
                                            <div class="reply">
                                                <div class="vertical-line"></div>
                                                <div class="reply-content">
                                                    <small class="date">${new Date(reply.date).toLocaleString()}</small>
                                                    <p><strong>${reply.author}</strong>: ${reply.content}</p>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                ` : ''}
                                <form class="replyForm" data-post-index="${postIndex}" data-comment-index="${commentIndex}">
                                    <input type="text" class="replyInput" placeholder="Add a reply" required autocomplete="off">
                                    <button type="submit">Reply</button>
                                </form>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            postsContainer.appendChild(postElement);
        });

        setupEventListenersForCommentsAndReplies();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function setupEventListenersForCommentsAndReplies() {
    document.querySelectorAll('.commentForm').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const postIndex = e.target.getAttribute('data-post-index');
            const commentInput = e.target.querySelector('.commentInput');
            addComment(postIndex, commentInput.value);
            commentInput.value = '';
        });
    });

    document.querySelectorAll('.replyForm').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const postIndex = e.target.getAttribute('data-post-index');
            const commentIndex = e.target.getAttribute('data-comment-index');
            const replyInput = e.target.querySelector('.replyInput');
            addReply(postIndex, commentIndex, replyInput.value);
            replyInput.value = '';
        });
    });

    document.querySelectorAll('.toggleComments').forEach(button => {
        button.addEventListener('click', (e) => {
            const commentsContent = e.target.nextElementSibling;
            if (commentsContent.style.display === 'none') {
                commentsContent.style.display = 'block';
                e.target.textContent = 'Hide Comments';
                e.target.setAttribute('aria-expanded', 'true');
            } else {
                commentsContent.style.display = 'none';
                e.target.textContent = 'Show Comments';
                e.target.setAttribute('aria-expanded', 'false');
            }
        });
    });

    document.querySelectorAll('.toggleReplies').forEach(button => {
        button.addEventListener('click', (e) => {
            const replies = e.target.nextElementSibling;
            if (replies.style.display === 'none') {
                replies.style.display = 'block';
                e.target.textContent = 'Hide Replies';
                e.target.setAttribute('aria-expanded', 'true');
            } else {
                replies.style.display = 'none';
                e.target.textContent = 'Show Replies';
                e.target.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

function addComment(postIndex, content) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return alert('Please log in to comment.');

    const newComment = {
        author: currentUser,
        content,
        date: new Date().toISOString(),
        replies: []
    };

    fetch(`http://192.168.1.118:3000/posts/${postIndex}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newComment),
    })
    .then(response => response.json())
    .then(() => fetchPosts())
    .catch(error => console.error('Error:', error));
}

function addReply(postIndex, commentIndex, content) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return alert('Please log in to reply.');

    const newReply = {
        author: currentUser,
        content,
        date: new Date().toISOString()
    };

    fetch(`http://192.168.1.118:3000/posts/${postIndex}/comments/${commentIndex}/replies`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReply),
    })
    .then(response => response.json())
    .then(() => fetchPosts())
    .catch(error => console.error('Error:', error));
}

function signup(username, password) {
    fetch('http://192.168.1.118:3000/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => {
        if (response.status === 201) {
            localStorage.setItem('currentUser', username);
            showForum();
        } else if (response.status === 400) {
            alert('Username already exists');
        } else {
            alert('Signup failed. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
}
