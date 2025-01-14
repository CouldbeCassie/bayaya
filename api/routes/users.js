const express = require('express');
const userController = require('../controllers/userController'); // Correct import path
const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router;
