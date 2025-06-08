// server/utils/jwtToken.js
const jwt = require('jsonwebtoken');

// Ensure dotenv is loaded here too, as this file might be imported by others.
// It's good practice to ensure the environment variables are always available where needed.
require('dotenv').config({ path: '/Users/jamesmeegan/Desktop/softwareDev/hospitalDoctorAdmin/.env' });

/**
 * Generates a JSON Web Token (JWT) for a given payload.
 * @param {object} payload - The data to include in the token (e.g., { user: { id: '...', role: '...' } }).
 * @returns {Promise<string>} A promise that resolves with the JWT string.
 */
async function generateToken(payload) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            process.env.JWT_SECRET, // Your secret key
            { expiresIn: '1h' },    // Token expiration time
            (err, token) => {
                if (err) {
                    console.error('JWT signing error:', err); // Log the actual error for debugging
                    return reject(new Error('Failed to generate authentication token.')); // Reject with a user-friendly error
                }
                resolve(token); // Resolve the promise with the generated token
            }
        );
    });
}

module.exports = { generateToken };