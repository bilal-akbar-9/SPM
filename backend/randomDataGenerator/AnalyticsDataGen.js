const { faker } = require("@faker-js/faker");
const AnalyticsSchema = require("../models/Analytics.schema");
const PharmacySchema = require("../models/Pharmacy.schema");
const MedicineSchema = require("../models/Medicine.schema");

const generateAnalyticsData = async () => {
    try {
        const pharmacies = await PharmacySchema.find().select('pharmacyId');
        const medicines = await MedicineSchema.find().select('medicationId');
        
        const pharmacyIds = pharmacies.map(p => p.pharmacyId);
        const medicineIds = medicines.map(m => m.medicationId);

        const analytics = [];
        const currentYear = new Date().getFullYear();
        const startYear = currentYear - 3; // 4 years including current year

        // For each pharmacy
        for (const pharmacyId of pharmacyIds) {
            // For each year
            for (let year = startYear; year <= currentYear; year++) {
                // For each month
                for (let month = 1; month <= 12; month++) {
                    // Skip future months in current year
                    if (year === currentYear && month > new Date().getMonth() + 1) continue;

                    const reportDate = new Date(year, month - 1, 
                        faker.number.int({ min: 1, max: 28 }));

                    // Generate prescription trends first
                    const prescriptionTrends = Array.from(
                        { length: faker.number.int({ min: 3, max: 8 }) },
                        () => ({
                            medicationId: faker.helpers.arrayElement(medicineIds),
                            totalPrescriptions: faker.number.int({ min: 10, max: 50 })
                        })
                    );

                    // Calculate total prescriptions processed
                    // Add 20-30% more than sum of individual prescriptions to account for repeats
                    const sumPrescriptions = prescriptionTrends.reduce(
                        (sum, trend) => sum + trend.totalPrescriptions, 0
                    );
                    const totalPrescriptionsProcessed = Math.round(
                        sumPrescriptions * (1 + faker.number.float({ min: 0.2, max: 0.3 }))
                    );

                    const monthlyAnalytics = {
                        pharmacyId,
                        reportMonth: month,
                        reportYear: year,
                        reportDate,
                        medicationUsageReport: Array.from(
                            { length: faker.number.int({ min: 3, max: 8 }) },
                            () => ({
                                medicationId: faker.helpers.arrayElement(medicineIds),
                                totalSold: faker.number.int({ min: 50, max: 200 })
                            })
                        ),
                        prescriptionTrends,
                        totalPrescriptionsProcessed
                    };
                    analytics.push(monthlyAnalytics);
                }
            }
        }

        // Clear existing data
        await AnalyticsSchema.deleteMany({});
        
        // Insert new data
        const createdAnalytics = await AnalyticsSchema.insertMany(analytics);
        console.log('Analytics data generated successfully:', createdAnalytics.length, 'records created');
        console.log(`Data generated for ${pharmacyIds.length} pharmacies from ${startYear} to ${currentYear}`);
        return createdAnalytics;
    } catch (error) {
        console.error('Error generating analytics data:', error);
        throw error;
    }
};

module.exports = generateAnalyticsData;