const PrescriptionSchema = require('../models/Prescription.schema');
const MedicineSchema = require('../models/Medicine.schema');

const prescriptionController = {
    getAllPrescriptions: async (req, res) => {
        try {
            const prescriptions = await PrescriptionSchema.find();
            res.status(200).json(prescriptions);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching prescriptions', error: error.message });
        }
    },

    getPrescriptionById: async (req, res) => {
        try {
            const prescription = await PrescriptionSchema.findOne({ _id: req.params.id });
            if (!prescription) {
                return res.status(404).json({ message: 'Prescription not found' });
            }
            res.status(200).json(prescription);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching prescription', error: error.message });
        }
    },

    createPrescription: async (req, res) => {
        try {
            const { patientId, medications } = req.body;

            if (!Array.isArray(medications) || medications.length === 0) {
                return res.status(400).json({ message: 'Medications must be a non-empty array' });
            }

            for (const med of medications) {
                const medicineExists = await MedicineSchema.findOne({ _id: med.medicationId });
                if (!medicineExists) {
                    return res.status(400).json({ message: `Medicine with ID ${med.medicationId} not found` });
                }
            }

            const newPrescription = new PrescriptionSchema({
                patientId,
                medications,
                status: 'Pending',
            });

            await newPrescription.save();
            res.status(201).json(newPrescription);
        } catch (error) {
            res.status(500).json({ message: 'Error creating prescription', error: error.message });
        }
    },

    getPatientPrescriptions: async (req, res) => {
        try {
            const prescriptions = await PrescriptionSchema.find({ patientId: req.params.patientId });
            if (!prescriptions.length) {
                return res.status(404).json({ message: 'No prescriptions found for this patient' });
            }
            res.status(200).json(prescriptions);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching patient prescriptions', error: error.message });
        }
    },

    getValidPrescriptionsByPatient: async (req, res) => {
        try {
            const prescriptions = await PrescriptionSchema.find({
                patientId: req.params.patientId,
                status: { $in: ['Pending', 'Fulfilled'] },
            });
            res.status(200).json(prescriptions);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching valid prescriptions', error: error.message });
        }
    },

    getMedicineDetails: async (req, res) => {
        try {
            const prescription = await PrescriptionSchema.findById(req.params.prescriptionId).populate('medications.medicationId');
            if (!prescription) {
                return res.status(404).json({ message: 'Prescription not found' });
            }
            const medicines = prescription.medications.map(med => ({
                medicationId: med.medicationId,
                dosage: med.dosage,
                quantity: med.quantity,
                instructions: med.instructions,
            }));
            res.status(200).json({ medicines });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching medicine details', error: error.message });
        }
    },

    updatePrescriptionStatus: async (req, res) => {
        try {
            const { prescriptionId } = req.params;
            const { status } = req.body;

            const prescription = await PrescriptionSchema.findByIdAndUpdate(
                prescriptionId,
                { status },
                { new: true }
            );

            if (!prescription) {
                return res.status(404).json({ message: 'Prescription not found' });
            }

            res.status(200).json({ message: 'Prescription status updated', prescription });
        } catch (error) {
            res.status(500).json({ message: 'Error updating prescription status', error: error.message });
        }
    },
};

module.exports = prescriptionController;
