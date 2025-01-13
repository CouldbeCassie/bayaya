const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    setupFormToggle();
    setupFormHandlers();
});

function setupFormToggle() {
    document.getElementById('show-signup').addEventListener('click', (e) => {
        e.preventDefault();
        toggleForms('register');
    });

    document.getElementById('show-login').addEventListener('click', (e) => {
        e.preventDefault();
        toggleForms('login');
    });
}

function toggleForms(formType) {
    if (formType === 'register') {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'block';
    } else {
        document.getElementById('register-form').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
    }
}

function setupFormHandlers() {
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    if (!validateInputs(username, password)) return;

    console.log('Sending registration request:', { username, password });

    try {
        const response = await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        console.log('Registration response status:', response.status);
        console.log('Registration response headers:', response.headers);

        handleResponse(response, 'User registered!', 'User registration failed!');
    } catch (error) {
        handleError(error, 'Error registering user');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    console.log('Sending login request:', { username, password });

    try {
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        console.log('Login response status:', response.status);
        console.log('Login response headers:', response.headers);

        handleResponse(response, 'Login successful!', 'Login failed!', true);
    } catch (error) {
        handleError(error, 'Error logging in');
    }
}

function validateInputs(username, password) {
    if (username.length < 3 || username.length > 15) {
        alert('Username must be between 3 and 15 characters.');
        return false;
    }
    if (password.length < 6 || password.length > 20) {
        alert('Password must be between 6 and 20 characters.');
        return false;
    }
    return true;
}

function handleResponse(response, successMessage, errorMessage, isLogin = false) {
    response.json().then(data => {
        if (response.ok) {
            alert(successMessage);
            setUser(data.user);
            if (isLogin) window.location.href = 'feed.html';
        } else {
            alert(errorMessage);
        }
    });
}

function handleError(error, errorMessage) {
    console.error(errorMessage, error);
    alert(errorMessage);
}

const logoutButton = document.getElementById('logout-button');
if (logoutButton) {
    logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('user');
        window.location.href = 'index.html';  // Redirect to the login page
    });
}

function setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

function getUser() {
    return JSON.parse(localStorage.getItem('user'));
}

// Load Posts
document.addEventListener('DOMContentLoaded', () => {
    const user = getUser();
    if (user) {
        document.getElementById('username-display').textContent = user.username;
    } else {
        window.location.href = 'login.html'; // Redirect to login page if not logged in
    }
    loadPosts();

    const createPostForm = document.getElementById('create-post-form');
    if (createPostForm) {
        createPostForm.addEventListener('submit', handlePostCreation);
    }
});

async function handlePostCreation(e) {
    e.preventDefault();
    const content = document.getElementById('post-content').value;
    console.log("Creating post with content:", content);

    const user = getUser();
    if (!user) {
        alert('You need to be logged in to create a post!');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content, username: user.username })
        });
        if (response.ok) {
            console.log("Post created successfully");
            document.getElementById('post-content').value = '';
            loadPosts();
        } else {
            throw new Error('Failed to create post');
        }
    } catch (error) {
        console.warn('Failed to create post on backend:', error);
        alert('Failed to create post!');
    }
}

async function loadPosts() {
    console.log("Loading posts...");
    try {
        const response = await fetch(`${API_URL}/posts`);
        if (!response.ok) throw new Error('Failed to fetch posts');
        const posts = await response.json();
        console.log("Posts loaded:", posts);

        const postsContainer = document.getElementById('posts-container');
        postsContainer.innerHTML = '';

        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <p><strong>${post.username}</strong>: ${post.content}</p>
                <p><small>${new Date(post.timestamp).toLocaleString()}</small></p>
                <button class="like-button" data-id="${post._id}" data-action="like"><i class="fas fa-thumbs-up"></i></button>
                <span class="like-count">${post.likes}</span>
                <button class="dislike-button" data-id="${post._id}" data-action="dislike"><i class="fas fa-thumbs-down"></i></button>
                <span class="dislike-count">${post.dislikes}</span>
            `;
            postsContainer.appendChild(postElement);
        });

        document.getElementById('posts-container').addEventListener('click', async (e) => {
            const button = e.target.closest('button');
            if (!button) return;
            const postId = button.getAttribute('data-id');
            const action = button.getAttribute('data-action');
            if (action === 'like' || action === 'dislike') {
                console.log(`${action === 'like' ? 'Liking' : 'Disliking'} post with ID: ${postId}`);
                await handlePostAction(postId, action);
            }
        });
    } catch (error) {
        console.error(error);
        alert('Failed to load posts!');
    }
}

async function handlePostAction(postId, action) {
    try {
        const response = await fetch(`${API_URL}/posts/${postId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action })
        });
        if (response.ok) {
            await loadPosts();
        } else {
            throw new Error(`Failed to ${action} post`);
        }
    } catch (error) {
        console.warn(`Failed to ${action} post on backend:`, error);
        alert(`Failed to ${action} post!`);
    }
}
