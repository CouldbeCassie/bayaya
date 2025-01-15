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
app.use('/api/users', userRoutes); // Ensure this is correct

app.post('/login', async (req, res) => {
    try {
        const response = await axios.post('http://your-php-server-url/php/login.php', req.body);
        res.send(response.data);
    } catch (error) {
        res.status(500).send('Error logging in');
    }
});

app.post('/register', async (req, res) => {
    try {
        const response = await axios.post('http://your-php-server-url/php/register.php', req.body);
        res.send(response.data);
    } catch (error) {
        res.status(500).send('Error registering');
    }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
