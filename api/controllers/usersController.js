const bcrypt = require('bcrypt');

exports.registerUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        if (!global.users) global.users = [];
        const newUser = { username, password: hashedPassword };
        global.users.push(newUser);
        
        res.status(201).send({ message: 'User registered!', user: newUser });
    } catch (error) {
        res.status(500).send({ error: 'Error registering user' });
    }
};

exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = global.users.find(user => user.username === username);
        if (!user) {
            return res.status(401).send({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({ error: 'Invalid credentials' });
        }

        res.status(200).send({ message: 'Login successful!', user });
    } catch (error) {
        res.status(500).send({ error: 'Error logging in' });
    }
};
