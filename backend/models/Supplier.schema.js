// models/Supplier.schema.js
const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema({
    supplierId: {
        type: String,
        required: true,
        unique: true,
        match: /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, // UUID
    },
    name: {
        type: String,
        required: true,
    },
    contactPerson: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const model = mongoose.model("Supplier", SupplierSchema);
module.exports = model;