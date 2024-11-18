const mongoose = require("mongoose");

const PrescriptionSchema = new mongoose.Schema({
    patientId: {
        type: String,
        required: true,
        match: /^[A-Z0-9]{6,8}$/,
    },
    medications: [
        {
            medicationId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Medicine',
                required: true,
            },
            dosage: { type: String, required: true },
            quantity: { type: Number, required: true, min: 1 },
            instructions: { type: String, required: true },
        },
    ],
    status: {
        type: String,
        enum: ["Pending", "Fulfilled", "Inprogress"],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const model = mongoose.model("Prescription", PrescriptionSchema);
module.exports = model;
