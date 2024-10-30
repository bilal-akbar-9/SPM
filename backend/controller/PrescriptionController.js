const PrescriptionSchema = require('../models/Prescription.schema');
const MedicineSchema = require('../models/Medicine.schema');

const prescriptionController = {
    // Get all prescriptions
    getAllPrescriptions: async (req, res) => {
        try {
            const prescriptions = await PrescriptionSchema.find();
            res.status(200).json(prescriptions);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching prescriptions', error: error.message });
        }
    },

    // Get prescription by ID
    getPrescriptionById: async (req, res) => {
        try {
            const prescription = await PrescriptionSchema.findOne({ prescriptionId: req.params.id });
            if (!prescription) {
                return res.status(404).json({ message: 'Prescription not found' });
            }
            res.status(200).json(prescription);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching prescription', error: error.message });
        }
    },

    // Create new prescription
    createPrescription: async (req, res) => {
        try {
            const { patientId, medications } = req.body;

            // Validate medications exist
            for (const med of medications) {
                const medicineExists = await MedicineSchema.findOne({ medicationId: med.medicationId });
                if (!medicineExists) {
                    return res.status(400).json({ 
                        message: `Medicine with ID ${med.medicationId} not found` 
                    });
                }
            }

            const newPrescription = new PrescriptionSchema({
                patientId,
                medications,
                status: 'Pending'
            });

            await newPrescription.save();
            res.status(201).json(newPrescription);
        } catch (error) {
            res.status(500).json({ message: 'Error creating prescription', error: error.message });
        }
    },


    // Get prescriptions by patient ID
    getPatientPrescriptions: async (req, res) => {
        try {
            const prescriptions = await PrescriptionSchema.find({ 
                patientId: req.params.patientId 
            });

            if (!prescriptions.length) {
                return res.status(404).json({ message: 'No prescriptions found for this patient' });
            }

            res.status(200).json(prescriptions);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching patient prescriptions', error: error.message });
        }
    }
};

module.exports = prescriptionController;