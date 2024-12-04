const { faker } = require("@faker-js/faker");
const InventoryService = require("../models/Inventory.schema");
const MedicineSchema = require("../models/Medicine.schema");
const PharmacySchema = require("../models/Pharmacy.schema");

const generateInventoryData = async () => {
    try {
        // Fetch all available medicines and pharmacies
        const [medicines, pharmacies] = await Promise.all([
            MedicineSchema.find(),
            PharmacySchema.find()
        ]);

        if (!medicines?.length) {
            console.error("No medicines found. Please generate medicine data first.");
            return;
        }

        if (!pharmacies?.length) {
            console.error("No pharmacies found. Please generate pharmacy data first.");
            return;
        }

        // Generate inventory data for each existing pharmacy
        const inventoryData = pharmacies.map(pharmacy => {
            // Generate random medications for the pharmacy
            const medications = Array.from(
                { length: faker.number.int({ min: 5, max: 15 }) }, 
                () => {
                    const randomMedicine = faker.helpers.arrayElement(medicines);
                    return {
                        medication: randomMedicine._id,
                        quantity: faker.number.int({ min: 10, max: 500 }),
                        expirationDate: faker.date.future(2),
                    };
                }
            );

            return {
                pharmacyId: pharmacy.pharmacyId, // Use existing pharmacy ID
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