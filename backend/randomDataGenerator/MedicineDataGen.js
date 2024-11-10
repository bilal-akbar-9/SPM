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
    const medicines = Array.from({ length: 50 }, () => {
			// Generate selling price first
			const sellingPrice = parseFloat(faker.number.float({ min: 5, max: 500, precision: 0.01 }));
			// Generate purchase price 20-40% lower than selling price
			const purchasePrice = parseFloat(
				(sellingPrice * faker.number.float({ min: 0.6, max: 0.8, precision: 0.01 })).toFixed(2)
			);

			return {
				medicationId: uuidv4(),
				name:
					faker.science.chemicalElement().name +
					" " +
					faker.helpers.arrayElement(["Tablet", "Capsule", "Syrup", "Injection", "Gel"]),
				description: faker.lorem.paragraph(),
				manufacturer: faker.company.name() + " Pharmaceuticals",
				price: sellingPrice,
				purchasePrice: purchasePrice,
				sideEffects: faker.helpers.arrayElements(
					commonSideEffects,
					faker.number.int({ min: 1, max: 5 })
				),
			};
		});

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