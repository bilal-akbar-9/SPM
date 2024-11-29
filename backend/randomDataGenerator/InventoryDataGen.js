const { faker } = require("@faker-js/faker");
const { v4: uuidv4 } = require("uuid");
const InventoryService = require("../models/Inventory.schema");
const MedicineSchema = require("../models/Medicine.schema");

const generateInventoryData = async () => {
    try {
        // Fetch all available medicines from the database
        const medicines = await MedicineSchema.find();
        if (!medicines || medicines.length === 0) {
            console.error("No medicines found. Please generate medicine data first.");
            return;
        }

        // Generate inventory data for 10 pharmacies
        const inventoryData = Array.from({ length: 10 }, () => {
            // Randomly generate pharmacyId
            const pharmacyId = uuidv4();

            // Generate random medications for the pharmacy
            const medications = Array.from({ length: faker.number.int({ min: 5, max: 15 }) }, () => {
                const randomMedicine = faker.helpers.arrayElement(medicines);
                return {
                    medication: randomMedicine._id,
                    quantity: faker.number.int({ min: 10, max: 500 }), // Random stock quantity
                    expirationDate: faker.date.future(2), // Random expiration date within the next 2 years
                };
            });

            return {
                pharmacyId,
                medications,
            };
        });

        // Clear existing inventory data
        await InventoryService.deleteMany({});
        
        // Insert new inventory data
        const createdInventory = await InventoryService.insertMany(inventoryData);
        console.log("Inventory data generated successfully:", createdInventory.length, "records created.");
        return createdInventory;
    } catch (error) {
        console.error("Error generating inventory data:", error);
        throw error;
    }
};

module.exports = generateInventoryData;
