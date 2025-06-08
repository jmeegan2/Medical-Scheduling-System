// server/routes/patients.js
const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient'); // Make sure to import Patient model

// This is the crucial line for importing your middleware:
const { auth, checkRole } = require('../middleware/auth'); // <--- CORRECTED IMPORT

// You'll eventually import your auth and role-checking middleware here:
// const auth = require('../middleware/auth');
// const checkRole = require('../middleware/auth'); 

// @route   GET /api/patients
// @desc    Get all patients
// @access  Private (Admin, Doctor)
router.get('/getAll', auth, checkRole(['admin', 'doctor']), async (req, res) => {
    try {
        const patients = await Patient.findAll(); // Use your static method
        res.json(patients);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/patients/:id
// @desc    Get patient by ID (Admin, Doctor)
// @access  Private (Admin, Doctor)
router.get('/getOne/:id', (req, res) => {
    res.send(`GET patient by ID: ${req.params.id} endpoint - (Admin, Doctor)`);
});

// @route   POST /api/patients/create
// @desc    Create a new patient record
// @access  Private (Admin, Doctor)
router.post('/create', auth, checkRole(['admin', 'doctor']), async (req, res) => { // <--- REPLACE THIS BLOCK
    const { name, dateOfBirth, contactInfo, medicalHistorySummary, assignedDoctorId } = req.body;

    // --- Basic validation for required fields ---
    if (!name || !dateOfBirth || !contactInfo || !medicalHistorySummary) {
        return res.status(400).json({ msg: 'Please enter all required patient fields: name, dateOfBirth, contactInfo, medicalHistorySummary.' });
    }
    
    // You might add more specific validation for date format, email, phone etc. here in a real app.

    try {
        const newPatientData = {
            name,
            dateOfBirth, // This will be converted to a Date object by your Patient model's create method
            contactInfo,
            medicalHistorySummary,
            assignedDoctorId: assignedDoctorId // Pass this if provided in the request, otherwise it will be null in the model
        };

        // Use the static create method from your Patient model
        const newPatient = await Patient.create(newPatientData);
        
        // Send a 201 Created status code and the new patient object
        res.status(201).json({ msg: 'Patient created successfully', patient: newPatient });

    } catch (err) {
        console.error('Error creating patient:', err.message); // Log the actual error for debugging
        res.status(500).send('Server Error'); // Send a generic server error response
    }
})
// @route   PUT /api/patients/:id
// @desc    Update a patient record (Admin, Doctor)
// @access  Private (Admin, Doctor)
router.put('/update/:id', (req, res) => {
    res.send(`PUT update patient by ID: ${req.params.id} endpoint - (Admin, Doctor)`);
});

module.exports = router;