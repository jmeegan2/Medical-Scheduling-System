const { MongoClient, ServerApiVersion } = require('mongodb');
// Load environment variables from your .env file
require('dotenv').config({ path: '/Users/jamesmeegan/Desktop/softwareDev/hospitalDoctorAdmin/.env' });

let _db; // Private variable to store the connected database instance

const connectDB = async (callback) => {
    if (_db) { // If already connected, return the existing connection
        console.log('MongoDB already connected (raw driver).');
        return callback(null, _db);
    }

    // Ensure MONGO_URI is loaded
    if (!process.env.MONGO_URI) {
        console.error('Error: MONGO_URI is not loaded from .env file. Please ensure it is set correctly.');
        return callback(new Error('MONGO_URI not found'), null);
    }

    const uri = process.env.MONGO_URI;

    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1, // Use ServerApiVersion.v1 as a direct object from the driver
            strict: true,
            deprecationErrors: true,
        },
        // Remove useNewUrlParser, useUnifiedTopology, useCreateIndex as they are deprecated or not needed for v4+ driver with serverApi
    });

    try {
        console.log('Attempting to connect to MongoDB (raw driver)...');
        await client.connect(); // Connect the client to the server
        _db = client.db('hospital_portal_db'); // Assign the specific database instance
        console.log("Pinged your deployment. You successfully connected to MongoDB (raw driver)!");
        console.log('MongoDB Connected (raw driver)...');
        callback(null, _db); // Callback with the connected db instance

    } catch (err) {
        console.error('MongoDB Connection Error (raw driver):', err.message);
        console.error('Full error object (raw driver):', err);
        client.close(); // Ensure client is closed on error
        callback(err, null); // Callback with the error
        process.exit(1); // Exit process with failure
    }
};

// Function to get the connected database instance
const getDb = () => {
    if (!_db) {
        throw new Error('No database connected!');
    }
    return _db;
};

module.exports = {
    connectDB,
    getDb
}
;