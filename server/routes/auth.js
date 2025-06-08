const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // For generating JSON Web Tokens
const User = require('../models/User'); // Import the new User class (not a Mongoose model)
const { getDb } = require('../config/db'); // Import getDb to potentially access collections directly if needed
const bcrypt = require('bcryptjs'); // For password comparison
const { generateToken } = require('../utils/jwtSigning'); // <--- ADD THIS LINE

// Ensure .env is loaded for JWT_SECRET (using the absolute path you prefer)
require('dotenv').config({ path: '/Users/jamesmeegan/Desktop/softwareDev/hospitalDoctorAdmin/.env' });

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;

    try {
        // Use the static create method from your User class
        // The create method handles checking for existing user and hashing the password
        const newUser = await User.create({ username, password, role });

        // Prepare the payload for the JWT
        const payload = {
            user: {
                id: newUser.id.toString(), // Convert ObjectId to string for JWT
                role: newUser.role
            }
        };

        const token = await generateToken(payload); 

        res.json({ token, msg: 'User registered successfully!' });

    } catch (err) {
        // If User.create throws an error (e.g., user exists)
        if (err.message === 'User already exists') {
            return res.status(400).json({ msg: err.message });
        }
        console.error(err.message);
        res.status(500).send('Server Error'); // Generic server error response
    }
});


// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Use the static findByUsername method from your User class
        let user = await User.findByUsername(username);

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' }); // Return generic error for security
        }

        // Use the static comparePassword method from your User class
        const isMatch = await User.comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' }); // Return generic error for security
        }

        // Return jsonwebtoken if authentication is successful
        const payload = {
            user: {
                id: user._id.toString(), // Convert ObjectId to string for JWT
                role: user.role
            }
        };

        const token = await generateToken(payload); 

        res.json({ token, user: { id: user._id.toString(), username: user.username, role: user.role }, msg: 'Logged in successfully!' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;