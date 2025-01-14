// api/controllers/userController.js

let users = [];

exports.register = (req, res) => {
  try {
    const { username, password } = req.body;
    if (users.some(user => user.username === username)) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const newUser = { username, password };  // For simplicity, no password hashing
    users.push(newUser);
    res.status(201).json({ message: 'User registered!', user: newUser });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Failed to register user' });
  }
};

exports.login = (req, res) => {
  try {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
      res.status(200).json({ message: 'Login successful!', user });
    } else {
      res.status(400).json({ message: 'Invalid username or password' });
    }
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ message: 'Failed to login user' });
  }
};
