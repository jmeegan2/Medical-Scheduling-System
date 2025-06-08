// server/models/Patient.js
const { ObjectId } = require('mongodb'); // Import ObjectId if you use it directly
const { getDb } = require('../config/db'); // Import getDb function

class Patient {
    constructor(name, dateOfBirth, contactInfo, medicalHistorySummary, assignedDoctorId = null) {
        this.name = name;
        this.dateOfBirth = dateOfBirth; // Stored as Date object
        this.contactInfo = contactInfo; // e.g., { phone: '123-456-7890', email: 'patient@example.com' }
        this.medicalHistorySummary = medicalHistorySummary;
        this.assignedDoctorId = assignedDoctorId ? new ObjectId(assignedDoctorId) : null; // Reference to Doctor User's _id
        this.createdAt = new Date(); // Timestamp for when the patient record was created
        this.updatedAt = new Date(); // Timestamp for last update
    }

    static collection() {
        const db = getDb();
        return db.collection('patients');
    }

    // Example: Find all patients
    static async findAll() {
        return await this.collection().find({}).toArray();
    }

    // Example: Find patient by ID
    static async findById(id) {
        if (!ObjectId.isValid(id)) {
            return null;
        }
        return await this.collection().findOne({ _id: new ObjectId(id) });
    }

    // Example: Create a new patient
    static async create(patientData) {
        const newPatient = new Patient(
            patientData.name,
            new Date(patientData.dateOfBirth), // Ensure date is stored as Date object
            patientData.contactInfo,
            patientData.medicalHistorySummary,
            patientData.assignedDoctorId
        );
        const result = await this.collection().insertOne(newPatient);
        newPatient._id = result.insertedId; // Assign the MongoDB-generated ID
        return newPatient;
    }

    // Example: Update a patient
    static async update(id, updateData) {
        if (!ObjectId.isValid(id)) {
            throw new Error('Invalid Patient ID');
        }
        const updateFields = { ...updateData };
        if (updateFields.dateOfBirth) {
            updateFields.dateOfBirth = new Date(updateFields.dateOfBirth);
        }
        updateFields.updatedAt = new Date();

        const result = await this.collection().findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateFields },
            { returnDocument: 'after' } // Returns the updated document
        );
        return result.value;
    }

    // Example: Delete a patient
    static async delete(id) {
        if (!ObjectId.isValid(id)) {
            throw new Error('Invalid Patient ID');
        }
        const result = await this.collection().deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0; // Returns true if a document was deleted
    }
}

module.exports = Patient;