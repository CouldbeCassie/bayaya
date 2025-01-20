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
        const category = document.getElementById('category').value; // Get category value
        const author = localStorage.getItem('currentUser');

        const newPost = {
            title,
            content,
            category, // Include category
            author,
            date: new Date().toISOString(),
            comments: []
        };

        savePost(newPost);
        fetchPosts();
        document.getElementById('postForm').reset();
    });

    document.getElementById('logout').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        showLogin();
    });

    document.getElementById('filterCategory').addEventListener('change', fetchPosts); // Add event listener

    fetchPosts();
});

function fetchPosts() {
    const selectedCategory = document.getElementById('filterCategory').value;
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = '';

    const filteredPosts = selectedCategory === 'All' ? posts : posts.filter(post => post.category === selectedCategory);

    filteredPosts.forEach((post, index) => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
        <div>
            <p><strong class="title">${post.title}</strong>. <small class="date">${new Date(post.date).toLocaleString()}</small></p>
             <p>Category:<strong>${post.category}</strong></p> <!-- Display category -->
        </div>
            <hr>
            <h3><strong>${post.author}:</strong></h3>
                <div class="content">
            <p>${post.content}</p>
                </div>
            <div class="comments">
                ${post.comments.map(comment => `
                <hr>
                    <div class="comment">
                        <small class="date">${new Date(comment.date).toLocaleString()}</small>
                        <p><strong>${comment.author}</strong>: ${comment.content}</p>
                    </div>
                `).join('')}
            </div>
            <form class="commentForm" data-index="${index}">
                <input type="text" class="commentInput" placeholder="Add a comment" required autocomplete="off">
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

    let users = [];
    try {
        users = JSON.parse(localStorage.getItem('users')) || [];
        if (!Array.isArray(users)) throw new Error('Users is not an array');
    } catch (error) {
        console.error('Failed to parse users from localStorage', error);
        users = [];
    }

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
    let users = [];
    try {
        users = JSON.parse(localStorage.getItem('users')) || [];
        if (!Array.isArray(users)) throw new Error('Users is not an array');
    } catch (error) {
        console.error('Failed to parse users from localStorage', error);
        alert('Error loading users. Please try again.');
        return;
    }

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
