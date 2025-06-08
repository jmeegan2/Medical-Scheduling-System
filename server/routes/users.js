// server/routes/users.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Needed for password hashing on updates

// Import your User model
const User = require('../models/user.js'); // <--- Make sure this file exists and has the necessary methods

// Import your auth and checkRole middleware
const { auth, checkRole } = require('../middleware/auth'); // <--- Corrected import


// @route   GET /api/users/getAll
// @desc    Get all users (Admin only)
// @access  Private (Admin)
router.get('/getAll', auth, checkRole(['admin']), async (req, res) => {
    try {
        // Fetch all users. Important: Exclude the password field from the response.
const users = await User.findAll({}, { password: 0 });
        res.json(users);
    } catch (err) {
        console.error('Error fetching all users:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/users/getOne/:id
// @desc    Get user by ID (Admin only)
// @access  Private (Admin)
router.get('/getOne/:id', auth, checkRole(['admin']), async (req, res) => {
    try {
        const userId = req.params.id;

        // Fetch user by ID. Exclude the password field.
        const user = await User.findById(userId, { projection: { password: 0 } }); // Assuming findById supports projection

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Error fetching user by ID:', err.message);
        // Handle cases where the ID format is invalid
        if (err.message.includes('Invalid User ID') || err.name === 'CastError') { // CastError if using Mongoose
            return res.status(400).json({ msg: 'Invalid user ID format.' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/users/create
// @desc    Create a new user (Admin only)
// @access  Private (Admin)
// NOTE: User creation for standard users is typically handled by the /api/auth/register route.
// This endpoint is for when an Admin needs to manually create a user account.
router.post('/create', auth, checkRole(['admin']), async (req, res) => {
    const { username, password, email, role } = req.body;

    // Basic validation for required fields
    if (!username || !password || !email || !role) {
        return res.status(400).json({ msg: 'Please enter all required fields: username, password, email, role.' });
    }

    try {
        // Check if a user with the provided username already exists
        let userExists = await User.findByUsername(username); // Assuming a findByUsername method in your User model
        if (userExists) {
            return res.status(400).json({ msg: 'User with that username already exists.' });
        }

        // Hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUserData = {
            username,
            password: hashedPassword, // Store the hashed password
            email,
            role
        };

        // Create the new user using your User model's static method
        const newUser = await User.create(newUserData);
        
        // IMPORTANT: Remove the password from the response object before sending it back
        // (Assuming newUser is an object that allows property deletion or is a plain JS object)
        const userWithoutPassword = { ...newUser }; // Create a copy to modify
        delete userWithoutPassword.password; 
        
        res.status(201).json({ msg: 'User created successfully', user: userWithoutPassword });

    } catch (err) {
        console.error('Error creating user:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/users/update/:id
// @desc    Update a user (Admin only)
// @access  Private (Admin)
router.put('/update/:id', auth, checkRole(['admin']), async (req, res) => {
    const userId = req.params.id;
    const updateFields = req.body; // Contains fields to update

    // Optional: Basic validation to ensure there's actually something to update
    if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ msg: 'No update fields provided.' });
    }

    // If the password field is present in the update request, hash the new password
    if (updateFields.password) {
        try {
            const salt = await bcrypt.genSalt(10);
            updateFields.password = await bcrypt.hash(updateFields.password, salt);
        } catch (err) {
            console.error('Error hashing new password for user update:', err.message);
            return res.status(500).send('Server Error during password hashing.');
        }
    }

    try {
        // Use your User model's static update method
        const updatedUser = await User.update(userId, updateFields); // Assuming Patient.update signature

        if (!updatedUser) {
            return res.status(404).json({ msg: 'User not found or could not be updated.' });
        }

        // IMPORTANT: Exclude the password from the response object
        const userWithoutPassword = { ...updatedUser };
        delete userWithoutPassword.password;
        res.json({ msg: 'User updated successfully', user: userWithoutPassword });

    } catch (err) {
        console.error('Error updating user:', err.message);
        // Handle specific error for invalid ID format
        if (err.message.includes('Invalid User ID') || err.name === 'CastError') {
            return res.status(400).json({ msg: 'Invalid user ID format.' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/users/delete/:id
// @desc    Delete a user (Admin only)
// @access  Private (Admin)
router.delete('/delete/:id', auth, checkRole(['admin']), async (req, res) => {
    const userId = req.params.id;

    try {
        // Security check: Prevent an admin from deleting their own account via this endpoint.
        // This avoids locking themselves out or accidental deletion of the primary admin.
        if (req.user.id === userId && req.user.role === 'admin') {
            return res.status(403).json({ msg: 'Admin cannot delete their own account via this endpoint.' });
        }

        const deleted = await User.delete(userId); // Use your User model's static delete method

        if (!deleted) {
            // If deleted count was 0, no document matched the ID
            return res.status(404).json({ msg: 'User not found.' });
        }

        res.json({ msg: 'User deleted successfully.' });

    } catch (err) {
        console.error('Error deleting user:', err.message);
        // Handle specific error for invalid ID format
        if (err.message.includes('Invalid User ID') || err.name === 'CastError') {
            return res.status(400).json({ msg: 'Invalid user ID format.' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;