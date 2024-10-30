const AnalyticsSchema = require('../models/Analytics.schema');

const analyticsController = {
    // Get all analytics data
    getAllAnalytics: async (req, res) => {
        try {
            const analytics = await AnalyticsSchema.find()
                .populate('medicationUsageReport.medicationId')
                .populate('prescriptionTrends.medicationId');
            res.status(200).json(analytics);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching analytics', error: error.message });
        }
    },

    // Get medication usage report
    getMedicationUsageReport: async (req, res) => {
        try {
            const analytics = await AnalyticsSchema.find()
                .select('medicationUsageReport')
                .populate('medicationUsageReport.medicationId');
            
            if (!analytics) {
                return res.status(404).json({ message: 'No medication usage reports found' });
            }

            res.status(200).json(analytics);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching medication usage report', error: error.message });
        }
    },

    // Get prescription trends
    getPrescriptionTrends: async (req, res) => {
        try {
            const analytics = await AnalyticsSchema.find()
                .select('prescriptionTrends')
                .populate('prescriptionTrends.medicationId');
            
            if (!analytics) {
                return res.status(404).json({ message: 'No prescription trends found' });
            }

            res.status(200).json(analytics);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching prescription trends', error: error.message });
        }
    },

    // Get analytics by date range
    getAnalyticsByDateRange: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;
            
            const analytics = await AnalyticsSchema.find({
                $or: [
                    { 'medicationUsageReport.reportDate': { $gte: new Date(startDate), $lte: new Date(endDate) } },
                    { 'prescriptionTrends.trendAnalysisDate': { $gte: new Date(startDate), $lte: new Date(endDate) } }
                ]
            }).populate('medicationUsageReport.medicationId')
              .populate('prescriptionTrends.medicationId');

            if (!analytics.length) {
                return res.status(404).json({ message: 'No analytics found for the specified date range' });
            }

            res.status(200).json(analytics);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching analytics by date range', error: error.message });
        }
    }
};

module.exports = analyticsController;