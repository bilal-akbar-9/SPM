const { ref } = require("joi");
const mongoose = require("mongoose");

const AnalyticsSchema = new mongoose.Schema({
	pharmacyId: {
		type: String,
		required: true,
		ref: "Pharmacy",
	},
	reportMonth: {
		type: Number,
		required: true,
		min: 1,
		max: 12,
	},
	reportYear: {
		type: Number,
		required: true,
		min: 2000,
	},
	reportDate: {
		type: Date,
		required: true,
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
		},
	],
	totalPrescriptionsProcessed: {
		type: Number,
		required: true,
		min: 0,
	},
});

const model = mongoose.model("Analytics", AnalyticsSchema);
module.exports = model;
