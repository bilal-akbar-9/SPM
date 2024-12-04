const PrescriptionSchema = require('../models/Prescription.schema');
const Medicine = require('../models/Medicine.schema');
const InventoryService = require('../models/Inventory.schema');

const axios = require('axios');

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
                const response = await axios.get(
                    `${process.env.VITE_API_URL}/pharmacy-api/medicine/${med.medicationId}`,
                    {
                        headers: {
                            Authorization: req.headers.authorization, // Forward token for validation
                        },
                    }
                );
                if (!response.data) {
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
            }).populate({
                path: 'medications.medicationId',
                model: 'Medicine',
                localField: 'medications.medicationId',
                foreignField: 'medicationId'
              });
              console.log(prescriptions)
            res.status(200).json(prescriptions);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching valid prescriptions', error: error.message });
        }
    },

    getMedicineDetails: async (req, res) => {
        try {
            // Find prescription by ID
            const prescription = await PrescriptionSchema.findById(req.params.prescriptionId);
            const { pharmacyId } = req.query;
    
            if (!prescription) {
                return res.status(404).json({ message: "Prescription not found" });
            }
    
            // Get pharmacy inventory
            const pharmacyInventory = await InventoryService.findOne({ pharmacyId })
                .populate('medications.medication');
    
            if (!pharmacyInventory) {
                return res.status(404).json({ message: "Pharmacy inventory not found" });
            }
    
            // Fetch medicine details and check availability
            const medicines = await Promise.all(
                prescription.medications.map(async (med) => {
                    const medicine = await Medicine.findOne({ medicationId: med.medicationId });
                    if (!medicine) {
                        throw new Error(`Medicine not found for ID: ${med.medicationId}`);
                    }
    
                    // Find medicine in pharmacy inventory
                    const inventoryItem = pharmacyInventory.medications.find(
                        invMed => invMed.medication.medicationId === med.medicationId
                    );
                    console
    
                    // Check if quantity is available
                    const availability = inventoryItem ? inventoryItem.quantity >= med.quantity : false;
    
                    return {
                        medicationId: med.medicationId,
                        name: medicine.name,
                        description: medicine.description,
                        manufacturer: medicine.manufacturer,
                        dosage: med.dosage,
                        quantity: med.quantity,
                        price: medicine.price,
                        sideEffects: medicine.sideEffects,
                        instructions: med.instructions,
                        availability, // Add availability boolean
                        availableQuantity: inventoryItem ? inventoryItem.quantity : 0,
                    };
                })
            );
    
            res.status(200).json({ medicines });
        } catch (error) {
            console.error("Error fetching medicine details:", error.message);
            res.status(500).json({ message: "Error fetching medicine details", error: error.message });
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
