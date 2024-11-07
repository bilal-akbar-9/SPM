const { faker } = require("@faker-js/faker");
const AnalyticsSchema = require("../models/Analytics.schema");
const PharmacySchema = require("../models/Pharmacy.schema");
const MedicineSchema = require("../models/Medicine.schema");

const generateAnalyticsData = async () => {
    try {
        // Get existing pharmacy and medicine IDs
        const pharmacies = await PharmacySchema.find().select('pharmacyId');
        const medicines = await MedicineSchema.find().select('medicationId');
        
        const pharmacyIds = pharmacies.map(p => p.pharmacyId);
        const medicineIds = medicines.map(m => m.medicationId);

        const analytics = Array.from({ length: 100 }, () => ({
            pharmacyId: faker.helpers.arrayElement(pharmacyIds),
            medicationUsageReport: Array.from(
                { length: faker.number.int({ min: 3, max: 8 }) },
                () => ({
                    medicationId: faker.helpers.arrayElement(medicineIds),
                    totalSold: faker.number.int({ min: 50, max: 300 }),
                    reportDate: faker.date.past({ years: 1 })
                })
            ),
            prescriptionTrends: Array.from(
                { length: faker.number.int({ min: 3, max: 8 }) },
                () => ({
                    medicationId: faker.helpers.arrayElement(medicineIds),
                    totalPrescriptions: faker.number.int({ min: 10, max: 100 }),
                    trendAnalysisDate: faker.date.past({ years: 1 })
                })
            )
        }));

        // Clear existing data
        await AnalyticsSchema.deleteMany({});
        
        // Insert new data
        const createdAnalytics = await AnalyticsSchema.insertMany(analytics);
        console.log('Analytics data generated successfully:', createdAnalytics.length, 'records created');
        return createdAnalytics;
    } catch (error) {
        console.error('Error generating analytics data:', error);
        throw error;
    }
};

module.exports = generateAnalyticsData;