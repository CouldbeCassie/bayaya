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
        const author = localStorage.getItem('currentUser');

        const newPost = {
            title,
            content,
            author,
            date: new Date().toISOString(),
            comments: []
        };

        savePost(newPost);
        fetchPosts();
        document.getElementById('postForm').reset(); // Reset the form after posting
    });

    document.getElementById('logout').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        showLogin();
    });

    fetchPosts();
});

function fetchPosts() {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = '';
    posts.forEach((post, index) => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.content}</p>
            <p>Author: ${post.author}</p>
            <p>Date: ${new Date(post.date).toLocaleString()}</p>
            <div class="comments">
                ${post.comments.map(comment => `
                    <div class="comment">
                        <p><strong>${comment.author}</strong>: ${comment.content}</p>
                        <small>${new Date(comment.date).toLocaleString()}</small>
                    </div>
                `).join('')}
            </div>
            <form class="commentForm" data-index="${index}">
                <input type="text" class="commentInput" placeholder="Add a comment" required>
                <button type="submit">Comment</button>
            </form>
        `;
        postsContainer.appendChild(postElement);
    });

    document.querySelectorAll('.commentForm').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const index = e.target.getAttribute('data-index');
            const commentInput = e.target.querySelector('.commentInput');
            addComment(index, commentInput.value);
            commentInput.value = '';
        });
    });
}

function addComment(index, content) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const author = localStorage.getItem('currentUser');
    const newComment = {
        author,
        content,
        date: new Date().toISOString()
    };
    posts[index].comments.push(newComment);
    localStorage.setItem('posts', JSON.stringify(posts));
    fetchPosts();
}

function savePost(post) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.push(post);
    localStorage.setItem('posts', JSON.stringify(posts));
}

function signup(username, password) {
    if (username.length < 4 || username.length > 10) {
        alert('Username must be between 4 and 10 characters long');
        return;
    }

    if (password.length < 6 || password.length > 26) {
        alert('Password must be between 6 and 26 characters long');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.find(user => user.username === username)) {
        alert('Username already exists');
        return;
    }

    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', username);
    showForum();
}

function login(username, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        localStorage.setItem('currentUser', username);
        showForum();
    } else {
        alert('Invalid username or password');
    }
}

function showLogin() {
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('signupSection').style.display = 'none';
    document.getElementById('forumSection').style.display = 'none';
    document.getElementById('showLogin').style.display = 'block';
    document.getElementById('showSignup').style.display = 'block';
    document.getElementById('logout').style.display = 'none';
}

function showSignup() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('signupSection').style.display = 'block';
    document.getElementById('forumSection').style.display = 'none';
    document.getElementById('showLogin').style.display = 'block';
    document.getElementById('showSignup').style.display = 'block';
    document.getElementById('logout').style.display = 'none';
}

function showForum() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('signupSection').style.display = 'none';
    document.getElementById('forumSection').style.display = 'block';
    document.getElementById('showLogin').style.display = 'none';
    document.getElementById('showSignup').style.display = 'none';
    document.getElementById('logout').style.display = 'block';
}
