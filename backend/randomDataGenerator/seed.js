// scripts/seed.js
const generateMedicineData = require('./MedicineDataGen');
const generatePharmacyData = require('./PharmacyDataGen');
const generateUserData = require('./UserDataGen');
const generatePrescriptionData = require('./PrescriptionDataGen');
const generateAnalyticsData = require('./AnalyticsDataGen');
const supplierDataGen = require('./SupplierDataGen');
const inventoryDataGen=require('./InventoryDataGen');
const mongoose = require('mongoose');
require('dotenv').config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_STRING);
        console.log('Connected to MongoDB...');

        // Generate data in sequence
        // await generatePharmacyData();
        // await generateMedicineData();
        // await generateUserData();
        // await generatePrescriptionData();
        // await generateAnalyticsData();
        // await supplierDataGen();
        await inventoryDataGen();

        console.log('Data seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();