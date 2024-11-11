const Medicine = require('../models/Medicine.schema');

const medicineController = {
    // Get all medicines
    getAllMedicines: async (req, res) => {
        try {
            const medicines = await Medicine.find();
            res.status(200).json(medicines);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching medicines', error: error.message });
        }
    },

    // Get medicine by ID
    getMedicineById: async (req, res) => {
        try {
            const medicine = await Medicine.findOne({ medicationId: req.params.id });
            if (!medicine) {
                return res.status(404).json({ message: 'Medicine not found' });
            }
            res.status(200).json(medicine);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching medicine', error: error.message });
        }
    },

    // Create new medicine
    createMedicine: async (req, res) => {
        try {
            const { medicationId, name, description, manufacturer, purchasePrice, price, sideEffects } = req.body;

            const newMedicine = new Medicine({
                medicationId,
                name,
                description,
                manufacturer,
                purchasePrice,
                price,
                sideEffects
            });

            await newMedicine.save();
            res.status(201).json(newMedicine);
        } catch (error) {
            res.status(500).json({ message: 'Error creating medicine', error: error.message });
        }
    },

    // Update medicine
    updateMedicine: async (req, res) => {
        try {
            const medicine = await Medicine.findOne({ medicationId: req.params.id });
            if (!medicine) {
                return res.status(404).json({ message: 'Medicine not found' });
            }

            const { name, description, manufacturer, purchasePrice, price, sideEffects } = req.body;

            medicine.name = name || medicine.name;
            medicine.description = description || medicine.description;
            medicine.manufacturer = manufacturer || medicine.manufacturer;
            medicine.purchasePrice = purchasePrice !== undefined ? purchasePrice : medicine.purchasePrice;
            medicine.price = price !== undefined ? price : medicine.price;
            medicine.sideEffects = sideEffects || medicine.sideEffects;

            await medicine.save();
            res.status(200).json(medicine);
        } catch (error) {
            res.status(500).json({ message: 'Error updating medicine', error: error.message });
        }
    },

    // Delete medicine
    deleteMedicine: async (req, res) => {
        try {
            const medicine = await Medicine.findOneAndDelete({ medicationId: req.params.id });
            if (!medicine) {
                return res.status(404).json({ message: 'Medicine not found' });
            }
            res.status(200).json({ message: 'Medicine deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting medicine', error: error.message });
        }
    }
};

module.exports = medicineController;
