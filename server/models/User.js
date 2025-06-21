// server/models/user.js

// Make sure you have this import for working with MongoDB ObjectIds
const { ObjectId } = require('mongodb');
const { getDb } = require('../config/db'); // Import the function to get the connected DB instance
const bcrypt = require('bcryptjs'); // For password hashing

class User {
    constructor(firstName, lastName, email, password, role = 'doctor') { // Updated to match database schema
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password; // This will be the plain text password initially (before hashing for storage)
        this.role = role;
        this.createdAt = new Date(); // Renamed 'date' to 'createdAt' for clarity
        this.updatedAt = new Date();
    }

    // --- Static Methods for DB Operations ---

    // Static method to create a new user
    static async create(userData) {
        const db = getDb();
        const usersCollection = db.collection('users');

        // Optional: Check if user already exists (username should be unique)
        // This check is also in the route, but good to have here if this is called directly
        const existingUser = await usersCollection.findOne({ email: userData.email });
        if (existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 400; // Custom property to hint at HTTP status
            throw error;
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        const newUserDocument = { // Renamed to newUserDocument to avoid conflict with class instance
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: hashedPassword, // Store the hashed password
            role: userData.role || 'doctor', // Default role if not provided
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await usersCollection.insertOne(newUserDocument);
        // Return the inserted document including its _id and all fields
        return { _id: result.insertedId, ...newUserDocument };
    }

    // Static method to find a user by email (Essential for login)
    static async findByEmail(email) {
        const db = getDb();
        return await db.collection('users').findOne({ email: email });
    }

    // NEW: Static method to find a user by ID
    static async findById(id, projection = {}) {
        const db = getDb();
        // Validate if the provided ID is a valid MongoDB ObjectId
        if (!ObjectId.isValid(id)) {
            const error = new Error('Invalid User ID format');
            error.statusCode = 400; // Use a custom status code for error handling
            throw error;
        }
        // Use findOne with the projection object as the second argument
        const user = await db.collection('users').findOne({ _id: new ObjectId(id) }, { projection: projection });
        return user;
    }

    // NEW: Static method to find all users
    static async findAll(query = {}, projection = {}) {
        const db = getDb();
        // Use .find() with query and .project() for projection, then .toArray()
        const users = await db.collection('users').find(query).project(projection).toArray();
        return users;
    }

    // NEW: Static method to update a user by ID
    static async update(id, updateData) {
        const db = getDb();
        if (!ObjectId.isValid(id)) {
            const error = new Error('Invalid User ID format');
            error.statusCode = 400;
            throw error;
        }

        // Prepare the update document. $set operator is used to update specific fields.
        const updateDoc = {
            $set: {
                ...updateData, // Spread the incoming updateData
                updatedAt: new Date() // Always update the updatedAt timestamp
            }
        };

        // findOneAndUpdate returns the document BEFORE the update by default.
        // { returnDocument: 'after' } makes it return the document *after* the update.
        // We're also projecting out the password from the returned document here for safety.
        const result = await db.collection('users').findOneAndUpdate(
            { _id: new ObjectId(id) },
            updateDoc,
            { returnDocument: 'after', projection: { password: 0 } } // Exclude password from the returned updated document
        );

        return result.value; // `value` contains the updated document
    }

    // NEW: Static method to delete a user by ID
    static async delete(id) {
        const db = getDb();
        if (!ObjectId.isValid(id)) {
            const error = new Error('Invalid User ID format');
            error.statusCode = 400;
            throw error;
        }

        const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });
        // Return true if a document was deleted (deletedCount > 0), false otherwise
        return result.deletedCount > 0;
    }

    // Static method to compare a plain-text password with a hashed password
    static async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = User;