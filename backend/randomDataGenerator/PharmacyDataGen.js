const { faker } = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid');
const PharmacySchema = require('../models/Pharmacy.schema');

const generatePharmacyData = async () => {
    const pharmacies = [
        {
            pharmacyId: uuidv4(),
            name: "LifeCare Pharmacy",
            location: faker.location.streetAddress() + ", " + faker.location.city(),
            contactInfo: faker.phone.number('+1 ### ### ####')
        },
        {
            pharmacyId: uuidv4(),
            name: "Wellness Plus Pharmacy",
            location: faker.location.streetAddress() + ", " + faker.location.city(),
            contactInfo: faker.phone.number('+1 ### ### ####')
        },
        {
            pharmacyId: uuidv4(),
            name: "Community Health Pharmacy",
            location: faker.location.streetAddress() + ", " + faker.location.city(),
            contactInfo: faker.phone.number('+1 ### ### ####')
        }
    ];

    try {
        // Clear existing data
        await PharmacySchema.deleteMany({});
        
        // Insert new data
        const createdPharmacies = await PharmacySchema.insertMany(pharmacies);
        console.log('Pharmacy data generated successfully:', createdPharmacies);
        return createdPharmacies;
    } catch (error) {
        console.error('Error generating pharmacy data:', error);
        throw error;
    }
};

module.exports = generatePharmacyData;