// models/PurchaseOrder.schema.js
const mongoose = require("mongoose");

const PurchaseOrderSchema = new mongoose.Schema(
	{
		pharmacyId: {
			type: String,
			required: true,
			ref: "Pharmacy",
		},
		supplierId: {
			type: String,
			required: true,
			ref: "Supplier",
		},
		medicationId: {
			type: String,
			required: true,
			ref: "Medicine",
		},
		quantity: {
			type: Number,
			required: true,
			min: 1,
		},
		unitPrice: {
			type: Number,
			required: true,
			min: 0,
		},
		totalPrice: {
			type: Number,
			required: true,
			min: 0,
		},
	},
	{
		timestamps: true,
	}
);

const PurchaseOrder = mongoose.model("PurchaseOrder", PurchaseOrderSchema);
module.exports = PurchaseOrder;
