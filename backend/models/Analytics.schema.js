const { ref } = require("joi");
const mongoose = require("mongoose");

const analyticsServiceSchema = new mongoose.Schema({
	medicationUsageReport: [
		{
			medicationId: {
                type: String,
                ref: "Medicine",
				required: true,
				match: /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, // UUID format
			},
			totalQuantityUsed: {
				type: Number,
				required: true,
				min: 0,
			},
			reportDate: {
				type: Date,
				required: true,
			},
		},
	],
	prescriptionTrends: [
		{
			medicationId: {
				type: String,
                required: true,
                ref: "Medicine",
				match: /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, // UUID format
			},
			totalPrescriptions: {
				type: Number,
				required: true,
				min: 0,
			},
			trendAnalysisDate: {
				type: Date,
				required: true,
			},
		},
	],
});

const AnalyticsService = mongoose.model("AnalyticsService", analyticsServiceSchema);
module.exports = AnalyticsService;
