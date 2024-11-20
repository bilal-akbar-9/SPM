// SupplierController.js
const SupplierSchema = require("../models/Supplier.schema");
const { v4: uuidv4 } = require("uuid");

const supplierController = {
    getAllSuppliers: async (req, res) => {
        try {
            const suppliers = await SupplierSchema.find()
                .sort({ name: 1 });
            res.status(200).json(suppliers);
        } catch (error) {
            res.status(500).json({ 
                message: "Error fetching suppliers", 
                error: error.message 
            });
        }
    },

    getSupplierById: async (req, res) => {
        try {
            const supplier = await SupplierSchema.findOne({ 
                supplierId: req.params.id 
            });
            
            if (!supplier) {
                return res.status(404).json({ message: "Supplier not found" });
            }
            res.status(200).json(supplier);
        } catch (error) {
            res.status(500).json({ 
                message: "Error fetching supplier", 
                error: error.message 
            });
        }
    },

    createSupplier: async (req, res) => {
        try {
            const supplierData = {
                ...req.body,
                supplierId: uuidv4()
            };

            const supplier = new SupplierSchema(supplierData);
            await supplier.save();

            res.status(201).json({
                message: "Supplier created successfully",
                supplier
            });
        } catch (error) {
            res.status(500).json({ 
                message: "Error creating supplier", 
                error: error.message 
            });
        }
    },

    updateSupplier: async (req, res) => {
        try {
            const supplier = await SupplierSchema.findOneAndUpdate(
                { supplierId: req.params.id },
                req.body,
                { new: true, runValidators: true }
            );

            if (!supplier) {
                return res.status(404).json({ message: "Supplier not found" });
            }

            res.status(200).json({
                message: "Supplier updated successfully",
                supplier
            });
        } catch (error) {
            res.status(500).json({ 
                message: "Error updating supplier", 
                error: error.message 
            });
        }
    },

    deleteSupplier: async (req, res) => {
        try {
            const supplier = await SupplierSchema.findOneAndDelete({
                supplierId: req.params.id
            });

            if (!supplier) {
                return res.status(404).json({ message: "Supplier not found" });
            }

            res.status(200).json({ 
                message: "Supplier deleted successfully" 
            });
        } catch (error) {
            res.status(500).json({ 
                message: "Error deleting supplier", 
                error: error.message 
            });
        }
    },

    toggleSupplierStatus: async (req, res) => {
        try {
            const supplier = await SupplierSchema.findOne({ 
                supplierId: req.params.id 
            });

            if (!supplier) {
                return res.status(404).json({ message: "Supplier not found" });
            }

            supplier.status = supplier.status === "Active" ? "Inactive" : "Active";
            await supplier.save();

            res.status(200).json({
                message: "Supplier status updated successfully",
                supplier
            });
        } catch (error) {
            res.status(500).json({ 
                message: "Error updating supplier status", 
                error: error.message 
            });
        }
    }
};

module.exports = supplierController;