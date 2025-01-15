const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const postRoutes = require('./api/routes/posts');
const userRoutes = require('./api/routes/users');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors({
  origin: ['http://cassaint.com', 'https://cassaint.com'],
  methods: ['GET', 'POST', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header']
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

app.get('/api/users', async (req, res) => {
    try {
        // Replace with actual logic to fetch user data, e.g., from a database
        const user = {
            username: 'john_doe',
            createdAt: '2023-01-15T09:41:00Z'
        };
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user data' });
    }
});

app.post('/api/users/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        // Replace with actual logic to register a user, e.g., saving to a database
        const newUser = {
            username,
            createdAt: new Date().toISOString()
        };
        res.status(201).json({ user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Failed to register user' });
    }
});

app.post('/api/users/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        // Replace with actual logic to authenticate a user
        const authenticatedUser = {
            username,
            createdAt: '2023-01-15T09:41:00Z'
        };
        res.json({ user: authenticatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Failed to login' });
    }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
