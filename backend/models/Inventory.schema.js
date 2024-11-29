const mongoose = require('mongoose');

const inventoryServiceSchema = new mongoose.Schema({
    pharmacyId: {
      type: String,
      required: true,
      match: /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, // UUID format
    },
    medications: [{
      medication: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicine',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 0,
      },
      expirationDate: {
        type: Date,
        required: true,
      },
    }],
});

const InventoryService = mongoose.model('InventoryService', inventoryServiceSchema);
module.exports = InventoryService;