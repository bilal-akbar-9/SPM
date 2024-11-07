const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        minlength: 6,
        maxlength: 8
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
        required: true
    },
    pharmacyId: {
        type: String,
        ref: "Pharmacy"
    }
}, {
    timestamps: true
});

const User = mongoose.model("User", UserSchema);
module.exports = User;