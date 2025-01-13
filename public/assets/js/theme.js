document.addEventListener('DOMContentLoaded', () => {
    const themeButton = document.getElementById('theme-button');
    if (themeButton) {
        themeButton.addEventListener('click', toggleTheme);
    }
    loadTheme(); // Apply the saved theme on page load
});

function toggleTheme() {
    const body = document.body;
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
    } else {
        body.setAttribute('data-theme', 'dark');
    }
    saveTheme(body.getAttribute('data-theme'));
}

function saveTheme(theme) {
    localStorage.setItem('theme', theme);
}

function loadTheme() {
    const theme = localStorage.getItem('theme');
    if (theme) {
        document.body.setAttribute('data-theme', theme);
    }
}
