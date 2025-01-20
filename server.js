const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const postRoutes = require('./api/routes/posts');
const userRoutes = require('./api/routes/users');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors({
  origin: ['http://cassaint.com', 'https://cassaint.com'],
  methods: ['GET', 'POST', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header']
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

// Mock database
const users = [
  { id: 1, username: 'john_doe', createdAt: '2023-01-15T09:41:00Z' },
  { id: 2, username: 'jane_doe', createdAt: '2023-01-20T10:00:00Z' }
];

app.get('/api/users/:id', (req, res) => {
  const user = users.find(user => user.id === parseInt(req.params.id));
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});
;

app.post('/api/users/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const newUser = {
            id: users.length + 1,
            username,
            createdAt: new Date().toISOString()
        };
        users.push(newUser);
        res.status(201).json({ user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Failed to register user' });
    }
});

app.post('/api/users/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = users.find(user => user.username === username);
        if (user) {
            res.json({ user });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to login' });
    }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use`);
  } else {
    console.error(err);
  }
});
