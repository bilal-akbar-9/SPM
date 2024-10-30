const mongoose = require("mongoose");

// Pharmacy Service Schema
const PharmacySchema = new mongoose.Schema({
	pharmacyId: {
		type: String,
		required: true,
		unique: true,
		match: /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, // UUID format
	},
	name: {
		type: String,
		required: true,
	},
	location: {
		type: String,
		required: true,
	},
	contactInfo: {
		type: String,
		required: true,
	},
});

const model = mongoose.model("Pharmacy", PharmacySchema);
module.exports = model;
