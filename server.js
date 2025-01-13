const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const postRoutes = require('./api/routes/posts');
const userRoutes = require('./api/routes/users');

const app = express();
const port = 3000;

// Middleware setup
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://cassaint.com',
  methods: ['GET', 'POST', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header']
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

// Database connection
mongoose.connect('mongodb://localhost:27017/yourdbname', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Database connected');
}).catch((err) => {
  console.error('Database connection error:', err);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
