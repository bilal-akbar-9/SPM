const mongoose = require("mongoose");

const MedicineSchema = new mongoose.Schema({
	medicationId: {
		type: String,
		required: true,
		unique: true,
		match: /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, // UUID format
	},
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	manufacturer: {
		type: String,
		required: true,
	},
	purchasePrice: {
		type: Number,
		required: true,
		min: 0,
	},
	price: {
		type: Number,
		required: true,
		min: 0,
	},
	sideEffects: [
		{
			type: String,
		},
	],
});

const model = mongoose.model("Medicine", MedicineSchema);
module.exports = model;
