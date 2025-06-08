require('dotenv').config({ path: '/Users/jamesmeegan/Desktop/softwareDev/hospitalDoctorAdmin/.env' }); 
const express = require('express');
const { connectDB, getDb } = require('./config/db');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Define a simple root route for testing
app.get('/', (req, res) => res.send('API Running'));

// Define Auth Routes
app.use('/api/auth', require('./routes/auth')); // Ensure this line is uncommented!

app.use('/api/users', require('./routes/users'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/appointments', require('./routes/appointments'));
const PORT = process.env.PORT || 3000;

connectDB((err, db) => {
    if (err) {
        console.error("Failed to connect to the database:", err);
        return;
    }
    console.log("Database connection successful (raw driver). Starting server...");

    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});