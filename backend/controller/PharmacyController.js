const PharmacySchema = require('../models/Pharmacy.schema');
const { v4: uuidv4 } = require('uuid');

const pharmacyController = {
    // Get all pharmacies 
    getAllPharmacies: async (req, res) => {
        try {
            const pharmacies = await PharmacySchema.find();
            
            res.status(200).json(pharmacies);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching pharmacies', error: error.message });
        }
    },

    // Get pharmacy by ID
    getPharmacyById: async (req, res) => {
        try {
            const pharmacy = await PharmacySchema.findOne({ pharmacyId: req.params.id });
            if (!pharmacy) {
                return res.status(404).json({ message: 'Pharmacy not found' });
            }
            res.status(200).json(pharmacy);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching pharmacy', error: error.message });
        }
    },

    // Create new pharmacy
    createPharmacy: async (req, res) => {
        try {
            const { name, location, contactInfo } = req.body;

            const newPharmacy = new PharmacySchema({
                pharmacyId: uuidv4(),
                name,
                location,
                contactInfo
            });

            await newPharmacy.save();
            res.status(201).json(newPharmacy);
        } catch (error) {
            res.status(500).json({ message: 'Error creating pharmacy', error: error.message });
        }
    },

    // Update pharmacy
    updatePharmacy: async (req, res) => {
        try {
            const pharmacy = await PharmacySchema.findOne({ pharmacyId: req.params.id });
            if (!pharmacy) {
                return res.status(404).json({ message: 'Pharmacy not found' });
            }

            const { name, location, contactInfo } = req.body;

            pharmacy.name = name || pharmacy.name;
            pharmacy.location = location || pharmacy.location;
            pharmacy.contactInfo = contactInfo || pharmacy.contactInfo;

            await pharmacy.save();
            res.status(200).json(pharmacy);
        } catch (error) {
            res.status(500).json({ message: 'Error updating pharmacy', error: error.message });
        }
    },

    // Delete pharmacy
    deletePharmacy: async (req, res) => {
        
        try {
            const pharmacy = await PharmacySchema.findOneAndDelete({ pharmacyId: req.params.id });
            if (!pharmacy) {
                return res.status(404).json({ message: 'Pharmacy not found' });
            }
            res.status(200).json({ message: 'Pharmacy deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting pharmacy', error: error.message });
        }
    }
};

module.exports = pharmacyController;