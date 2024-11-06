const { faker } = require("@faker-js/faker");
const { v4: uuidv4 } = require("uuid");
const PrescriptionSchema = require("../models/Prescription.schema");
const UserSchema = require("../models/User.schema");
const MedicineSchema = require("../models/Medicine.schema");

const generatePrescriptionData = async () => {
    try {
        // Get existing user and medicine IDs
        const users = await UserSchema.find().select('_id');
        const medicines = await MedicineSchema.find().select('medicationId');
        
        const userIds = users.map(u => u._id);
        const medicineIds = medicines.map(m => m.medicationId);

        const prescriptions = Array.from({ length: 25 }, () => ({
            patientId: faker.helpers.arrayElement(userIds),
            medications: Array.from(
                { length: faker.number.int({ min: 1, max: 4 }) },
                () => ({
                    medicationId: faker.helpers.arrayElement(medicineIds),
                    dosage: faker.helpers.arrayElement([
                        "1 tablet daily",
                        "2 tablets twice daily",
                        "1 capsule every 8 hours",
                        "10ml three times daily",
                        "1 tablet before meals"
                    ]),
                    quantity: faker.number.int({ min: 10, max: 60 }),
                    instructions: faker.helpers.arrayElement([
                        "Take with food",
                        "Take on empty stomach",
                        "Take before bedtime",
                        "Take as needed",
                        "Take with plenty of water"
                    ])
                })
            ),
            status: faker.helpers.arrayElement(["Pending", "Fulfilled", "Cancelled"]),
            createdAt: faker.date.past({ years: 1 })
        }));

        // Clear existing data
        await PrescriptionSchema.deleteMany({});
        
        // Insert new data
        const createdPrescriptions = await PrescriptionSchema.insertMany(prescriptions);
        console.log('Prescription data generated successfully:', createdPrescriptions.length, 'records created');
        return createdPrescriptions;
    } catch (error) {
        console.error('Error generating prescription data:', error);
        throw error;
    }
};

module.exports = generatePrescriptionData;