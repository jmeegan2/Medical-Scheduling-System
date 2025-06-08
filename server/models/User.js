const { getDb } = require('../config/db'); // Import the function to get the connected DB instance
const bcrypt = require('bcryptjs'); // For password hashing

class User {
    constructor(username, password, role = 'doctor') {
        this.username = username;
        this.password = password; // This will be the plain text password initially
        this.role = role;
        this.date = new Date();
    }

    // Static method to create a new user
    static async create(userData) {
        const db = getDb(); // Get the connected database instance
        const usersCollection = db.collection('users'); // Get the 'users' collection

        // 1. Check if user already exists
        const existingUser = await usersCollection.findOne({ username: userData.username });
        if (existingUser) {
            throw new Error('User already exists');
        }

        // 2. Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        // Create a user object with the hashed password
        const newUser = {
            username: userData.username,
            password: hashedPassword, // Store the hashed password
            role: userData.role || 'doctor',  //'admin', 'doctor', 'patient' - if patients log in
            date: new Date()
        };

        // 3. Insert the new user into the collection
        const result = await usersCollection.insertOne(newUser);
        // Optionally, return the inserted document's ID and original data (excluding password)
        return { id: result.insertedId, username: newUser.username, role: newUser.role, date: newUser.date };
    }

    // Static method to find a user by username
    static async findByUsername(username) {
        const db = getDb();
        return await db.collection('users').findOne({ username: username });
    }

    // Static method to compare a plain-text password with a hashed password
    static async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = User;