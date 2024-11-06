const { faker } = require("@faker-js/faker");
const { v4: uuidv4 } = require("uuid");
const MedicineSchema = require("../models/Medicine.schema");

const commonSideEffects = [
    "Nausea", "Headache", "Dizziness", "Fatigue",
    "Drowsiness", "Dry mouth", "Insomnia", "Anxiety",
    "Stomach pain", "Rash", "Blurred vision", "Constipation",
    "Diarrhea", "Loss of appetite", "Muscle pain"
];

const generateMedicineData = async () => {
    const medicines = Array.from({ length: 50 }, () => ({
        medicationId: uuidv4(),
        name: faker.science.chemicalElement().name + " " + 
              faker.helpers.arrayElement(["Tablet", "Capsule", "Syrup", "Injection", "Gel"]),
        description: faker.lorem.paragraph(),
        manufacturer: faker.company.name() + " Pharmaceuticals",
        price: parseFloat(faker.number.float({ min: 5, max: 500, precision: 0.01 })),
        sideEffects: faker.helpers.arrayElements(
            commonSideEffects,
            faker.number.int({ min: 1, max: 5 })
        )
    }));

    try {
        // Clear existing data
        await MedicineSchema.deleteMany({});
        
        // Insert new data
        const createdMedicines = await MedicineSchema.insertMany(medicines);
        console.log('Medicine data generated successfully:', createdMedicines.length, 'records created');
        return createdMedicines;
    } catch (error) {
        console.error('Error generating medicine data:', error);
        throw error;
    }
};

module.exports = generateMedicineData;