const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    setupFormHandlers();
    setupLogoutButton();
    setupDropdown();
    setupAuthToggle();
    checkAuthentication();
    fetchAccountInfo();
});

async function fetchAccountInfo() {
    const user = getUser();
    if (user) {
        console.log('Fetching account info for user ID:', user.id); // Log user ID
        try {
            const response = await fetch(`${API_URL}/users/${user.id}`);
            console.log('Server response:', response); // Log server response
            if (response.ok) {
                const accountInfo = await response.json();
                console.log('Account info:', accountInfo); // Log account info
                document.getElementById('username').textContent = accountInfo.username;
                document.getElementById('created-at').textContent = new Date(accountInfo.createdAt).toLocaleDateString();
            } else {
                console.error('Failed to fetch account information');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

function checkAuthentication() {
    const user = getUser();
    const isLoginPage = window.location.pathname.includes('login.html');

    if (user) {
        const usernameDisplay = document.getElementById('username-display');
        if (usernameDisplay) {
            usernameDisplay.textContent = user.username;
        }

        if (isLoginPage) {
            window.location.href = 'feed.html';
        } else {
            loadPosts();
        }
    } else if (!isLoginPage) {
        window.location.href = 'login.html';
    }
}

function setupFormHandlers() {
    const createPostForm = document.getElementById('create-post-form');
    if (createPostForm) {
        createPostForm.addEventListener('submit', handlePostCreation);
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

function setupLogoutButton() {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
}

function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

async function handlePostCreation(e) {
    e.preventDefault();
    const content = document.getElementById('post-content').value.trim();

    if (!content) {
        alert('Post content cannot be empty!');
        return;
    }

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
            document.getElementById('post-content').value = '';
            await loadPosts();
        } else {
            throw new Error('Failed to create post');
        }
    } catch (error) {
        console.warn('Failed to create post on backend:', error);
        alert('Failed to create post!');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (response.ok) {
            const result = await response.json();
            localStorage.setItem('user', JSON.stringify(result.user));
            window.location.href = 'feed.html';
        } else {
            const result = await response.json();
            alert(result.message);
        }
    } catch (error) {
        console.warn('Failed to register on backend:', error);
        alert('Failed to register!');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (response.ok) {
            const result = await response.json();
            localStorage.setItem('user', JSON.stringify(result.user));
            window.location.href = 'feed.html';
        } else {
            const result = await response.json();
            alert(result.message);
        }
    } catch (error) {
        console.warn('Failed to login on backend:', error);
        alert('Failed to login!');
    }
}

async function loadPosts() {
    try {
        console.log('Attempting to load posts...');
        const response = await fetch(`${API_URL}/posts`);
        if (!response.ok) throw new Error('Failed to fetch posts');
        const posts = await response.json();

        const postsContainer = document.getElementById('posts-container');
        postsContainer.innerHTML = '';

        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <p><small>${new Date(post.timestamp).toLocaleString()}</small></p>
                <p><strong>${post.username}:</strong> ${post.content}</p>
                <button class="like-button" data-id="${post._id}" data-action="like"><i class="fas fa-thumbs-up"></i></button>
                <span class="like-count">${post.likes}</span>
                <button class="dislike-button" data-id="${post._id}" data-action="dislike"><i class="fas fa-thumbs-down"></i></button>
                <span class="dislike-count">${post.dislikes}</span>
            `;
            postsContainer.appendChild(postElement);
        });

        postsContainer.addEventListener('click', async (e) => {
            const button = e.target.closest('button');
            if (!button) return;
            const postId = button.getAttribute('data-id');
            const action = button.getAttribute('data-action');
            if (action === 'like' || action === 'dislike') {
                await handlePostAction(postId, action);
            }
        });
    } catch (error) {
        console.error('Failed to load posts:', error);
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

function getUser() {
    return JSON.parse(localStorage.getItem('user'));
}

function setupDropdown() {
    const dropdownToggle = document.getElementById('dropdown-toggle');
    const dropdownContent = document.getElementById('dropdown-content');

    if (dropdownToggle && dropdownContent) {
        dropdownToggle.addEventListener('click', () => {
            dropdownContent.classList.toggle('show');
        });

        // Close the dropdown if the user clicks outside of it
        window.addEventListener('click', (e) => {
            if (!e.target.matches('#dropdown-toggle')) {
                if (dropdownContent.classList.contains('show')) {
                    dropdownContent.classList.remove('show');
                }
            }
        });
    } else {
        console.error('Dropdown elements not found');
    }
}

function setupAuthToggle() {
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (showSignup) {
        showSignup.addEventListener('click', (e) => {
            e.preventDefault();
            if (loginForm) loginForm.style.display = 'none';
            if (registerForm) registerForm.style.display = 'block';
        });
    }

    if (showLogin) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            if (registerForm) registerForm.style.display = 'none';
            if (loginForm) loginForm.style.display = 'block';
        });
    }
}
