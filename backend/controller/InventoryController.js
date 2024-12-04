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
   getLowStockInventories : async (req, res) => {
    try {
        const lowStockInventories = await InventoryService.find({
            'medications.quantity': { $lt: 20 }
        }).populate('medications.medication');

        if (!lowStockInventories.length) {
            return res.status(404).json({ message: "No low-stock inventories found." });
        }

        res.status(200).json({ inventories: lowStockInventories });
    } catch (error) {
        console.error('Error fetching low-stock inventories:', error);
        res.status(500).json({ message: "Internal Server Error." });
    }
  },
   updateQuantity : async (req, res) => {
    const { pharmacyId } = req.params;
    const { medicationId, quantity } = req.body;
  
    try {
      // Validate the input
      if (!medicationId || quantity === undefined || quantity < 0) {
        return res.status(400).json({
          message: "Invalid input. Medication ID and a non-negative quantity are required.",
        });
      }
  
      // Find the inventory record for the given pharmacy
      const inventory = await InventoryService.findOne({ pharmacyId });
  
      if (!inventory) {
        return res.status(404).json({
          message: "Pharmacy inventory not found.",
        });
      }
  
      // Find the medication within the inventory
      const medication = inventory.medications.find(
        (med) => med.medication.toString() === medicationId
      );
  
      if (!medication) {
        return res.status(404).json({
          message: "Medication not found in inventory.",
        });
      }
  
      // Update the quantity
      medication.quantity = quantity;
  
      // Save the updated inventory
      await inventory.save();
  
      return res.status(200).json({
        message: "Quantity updated successfully.",
        updatedMedication: medication,
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
      return res.status(500).json({
        message: "An error occurred while updating the quantity.",
        error: error.message,
      });
    }
  }
  

};

module.exports = InventoryController;
