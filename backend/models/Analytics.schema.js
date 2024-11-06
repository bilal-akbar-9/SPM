const { ref } = require("joi");
const mongoose = require("mongoose");

const AnalyticsSchema = new mongoose.Schema({
	pharmacyId: {
		type: String,
		required: true,
		ref: "Pharmacy",
	},
	medicationUsageReport: [
		{
			medicationId: {
                type: String,
                ref: "Medicine",
				required: true,
				match: /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, // UUID format
			},
			totalSold: {
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

const model = mongoose.model("Analytics", AnalyticsSchema);
module.exports = model;
