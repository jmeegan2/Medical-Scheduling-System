// server/routes/patients.js
const express = require('express');
const router = express.Router();

const Patient = require('../models/Patient');
const { auth, checkRole } = require('../middleware/auth');


// @route   GET /api/patients/getAll
// @desc    Get all patients
// @access  Private (Admin, Doctor)
router.get('/getAll', auth, checkRole(['admin', 'doctor']), async function getAllPatients(req, res) {
    try {
        const patients = await Patient.findAll();
        res.json(patients);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/patients/getOne/:id
// @desc    Get patient by ID (Admin, Doctor)
// @access  Private (Admin, Doctor)
router.get('/getOne/:id', auth, checkRole(['admin', 'doctor']), async (req, res) => {
    try {
        const patientId = req.params.id;

        const patient = await Patient.findById(patientId);

        if (!patient) {
            return res.status(404).json({ msg: 'Patient not found' });
        }

        res.json(patient);

    } catch (err) {
        console.error('Error fetching patient by ID:', err.message);
        if (err.message.includes('Invalid Patient ID') || err.name === 'CastError') {
            return res.status(400).json({ msg: 'Invalid patient ID format' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/patients/create
// @desc    Create a new patient record (Admin, Doctor)
// @access  Private (Admin, Doctor)
router.post('/create', auth, checkRole(['admin', 'doctor']), async (req, res) => {
    const { name, dateOfBirth, contactInfo, medicalHistorySummary, assignedDoctorId } = req.body;

    if (!name || !dateOfBirth || !contactInfo || !medicalHistorySummary) {
        return res.status(400).json({ msg: 'Please enter all required patient fields: name, dateOfBirth, contactInfo, medicalHistorySummary.' });
    }
    
    try {
        const newPatientData = {
            name,
            dateOfBirth,
            contactInfo,
            medicalHistorySummary,
            assignedDoctorId: assignedDoctorId
        };

        const newPatient = await Patient.create(newPatientData);
        
        res.status(201).json({ msg: 'Patient created successfully', patient: newPatient });

    } catch (err) {
        console.error('Error creating patient:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/patients/update/:id
// @desc    Update a patient record (Admin, Doctor)
// @access  Private (Admin, Doctor)
router.put('/update/:id', auth, checkRole(['admin', 'doctor']), async (req, res) => { // <--- IMPLEMENT THIS ROUTE
    const patientId = req.params.id;
    const updateFields = req.body; // The request body will contain the fields to update

    // Optional: Basic validation to ensure there's actually something to update
    if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ msg: 'No update fields provided.' });
    }

    try {
        const updatedPatient = await Patient.update(patientId, updateFields);

        if (!updatedPatient) {
            return res.status(404).json({ msg: 'Patient not found or could not be updated.' });
        }

        res.json({ msg: 'Patient updated successfully', patient: updatedPatient });

    } catch (err) {
        console.error('Error updating patient:', err.message);
        // Handle specific error for invalid ID format
        if (err.message.includes('Invalid Patient ID') || err.name === 'CastError') {
            return res.status(400).json({ msg: 'Invalid patient ID format.' });
        }
        res.status(500).send('Server Error');
    }
}); // <--- END OF BLOCK TO REPLACE


// @route   DELETE /api/patients/delete/:id
// @desc    Delete a patient record
// @access  Private (Admin Only)

router.delete('/delete/:id', auth, checkRole(['admin']), async (req, res) => { // <--- CHANGE HERE: Only 'admin' later on consider 'doctor' too
    const patientId = req.params.id;

    try {
        const deleted = await Patient.delete(patientId); 

        if (!deleted) {
            return res.status(404).json({ msg: 'Patient not found.' });
        }

        res.json({ msg: 'Patient deleted successfully.' });

    } catch (err) {
        console.error('Error deleting patient:', err.message);
        if (err.message.includes('Invalid Patient ID') || err.name === 'CastError') {
            return res.status(400).json({ msg: 'Invalid patient ID format.' });
        }
        res.status(500).send('Server Error');
    }
 });
   
module.exports = router;