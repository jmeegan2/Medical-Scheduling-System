// server/models/Appointment.js
const { ObjectId } = require('mongodb');
const { getDb } = require('../config/db');

class Appointment {
    constructor(patientId, doctorId, date, time, reason, status = 'scheduled') {
        // Ensure IDs are ObjectId instances
        this.patientId = new ObjectId(patientId);
        this.doctorId = new ObjectId(doctorId);
        this.date = new Date(date); // Store date as a Date object
        this.time = time; // Could be 'HH:MM' string or part of Date object
        this.reason = reason;
        this.status = status; // e.g., 'scheduled', 'completed', 'cancelled'
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    static collection() {
        const db = getDb();
        return db.collection('appointments');
    }

    // Example: Find all appointments
    static async findAll() {
        return await this.collection().find({}).toArray();
    }

    // Example: Find appointment by ID
    static async findById(id) {
        if (!ObjectId.isValid(id)) {
            return null;
        }
        return await this.collection().findOne({ _id: new ObjectId(id) });
    }

    // Example: Create a new appointment
    static async create(appointmentData) {
        const newAppointment = new Appointment(
            appointmentData.patientId,
            appointmentData.doctorId,
            appointmentData.date,
            appointmentData.time,
            appointmentData.reason,
            appointmentData.status
        );
        const result = await this.collection().insertOne(newAppointment);
        newAppointment._id = result.insertedId;
        return newAppointment;
    }

    // Example: Update an appointment
    static async update(id, updateData) {
        if (!ObjectId.isValid(id)) {
            throw new Error('Invalid Appointment ID');
        }
        const updateFields = { ...updateData };
        if (updateFields.date) {
            updateFields.date = new Date(updateFields.date);
        }
        updateFields.updatedAt = new Date();

        const result = await this.collection().findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateFields },
            { returnDocument: 'after' }
        );
        return result.value;
    }

    // Example: Delete an appointment
    static async delete(id) {
        if (!ObjectId.isValid(id)) {
            throw new Error('Invalid Appointment ID');
        }
        const result = await this.collection().deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    }
}

module.exports = Appointment;