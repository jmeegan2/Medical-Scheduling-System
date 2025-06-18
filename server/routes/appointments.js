// server/routes/appointments.js
const express = require('express');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const User = require('../models/User');
const router = express.Router();

// You'll eventually import your Appointment model here:
// const Appointment = require('../models/Appointment'); 

// You'll eventually import your auth and role-checking middleware here:
const { auth, checkRole } = require('../middleware/auth');


// @route   GET /api/appointments
// @desc    Get all appointments (Admin, Doctor, Patient-if-theirs)
// @access  Private
router.get('/getAll', auth, checkRole(['admin', 'doctor']), async function getAllAppointments(req, res) {
    try {
        const appointments = await Appointment.findAll();
        for (const appointment of appointments) {
            const patient = await Patient.findById(appointment.patientId);
            const doctor = await User.findById(appointment.doctorId);
            appointment.patient = patient.name;
            appointment.doctor = doctor.name;
        }
        res.json(appointments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/getOne/:id', auth, async (req, res) => {
    try {
        const appointmentId = req.params.id;

        // Find the appointment by its ID
        const appointment = await Appointment.findById(appointmentId);

        // If no appointment is found, return a 404
        if (!appointment) {
            return res.status(404).json({ msg: 'Appointment not found' });
        }

        // Send the appointment data as JSON
        res.json(appointment);

    } catch (err) {
        console.error('Error fetching appointment by ID:', err.message);

        // Handle specific error for invalid MongoDB ID format
        if (err.name === 'CastError' && err.path === '_id') {
            return res.status(400).json({ msg: 'Invalid Appointment ID format.' });
        }
        // Catch any other server errors
        res.status(500).send('Server Error');
    }
});



// @route   POST /api/appointments
// @desc    Create a new appointment (Doctor only)
// @access  Private (Doctor)
router.post('/createAppointment', auth, checkRole(['doctor']), async (req, res) => {
    try {
        const { patient, doctor, date, time, reason, status = 'pending' } = req.body;

        if (!patient || !doctor || !date || !time || !reason) {
            return res.status(400).json({ msg: 'Please enter all required fields: patient, doctor, date, time, reason' });
        }

        const newAppointment = await Appointment.create({
            patient,
            doctor,
            date,
            time,
            reason,
            status
        });

        res.status(201).json({ msg: 'Appointment created successfully', appointment: newAppointment });

    } catch (err) {
        console.error('Error creating appointment:', err.message);

        if (err.message.includes('Invalid') || err.name === 'CastError') {
            return res.status(400).json({ msg: err.message });
        }
        if (err.message.includes('Appointment already exists') || err.code === 11000) {
            return res.status(400).json({ msg: 'Appointment already exists or duplicate key error.' });
        }

        res.status(500).send('Server Error');
    }
});
module.exports = router;