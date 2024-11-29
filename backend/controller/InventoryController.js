const InventoryService = require("../models/Inventory.schema");
const MedicineSchema = require("../models/Medicine.schema");

const InventoryController = {
  getInventoryByPharmacyId: async (req, res) => {
    try {
      const { pharmacyId } = req.params;

      // Validate pharmacyId format
      if (
        !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
          pharmacyId
        )
      ) {
        return res.status(400).json({ message: "Invalid pharmacyId format" });
      }

      // Find inventory for the given pharmacyId and populate medication details
      const inventory = await InventoryService.findOne({ pharmacyId }).populate(
        "medications.medication",
        "name manufacturer price sideEffects"
      );

      if (!inventory) {
        return res
          .status(404)
          .json({ message: "Inventory not found for the given pharmacyId" });
      }

      res.status(200).json(inventory);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  getAllInventories: async (req, res) => {
    try {
      const inventories = await InventoryService.find().populate(
        "medications.medication",
        "name manufacturer price sideEffects"
      );

      res.status(200).json(inventories);
      
    } catch (error) {
      console.error("Error fetching inventories:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = InventoryController;
