// SupplierRoutes.js
const express = require("express");
const router = express.Router();
const supplierController = require("../controller/SupplierController");
const { VerifyToken, VerifyAdmin } = require("../utils/Authentication");

/**
 * @route GET /api/suppliers
 * @desc Get all suppliers
 */
router.get("/", VerifyToken, VerifyAdmin, supplierController.getAllSuppliers);

/**
 * @route GET /api/suppliers/:id
 * @desc Get supplier by ID
 */
router.get("/:id", VerifyToken, VerifyAdmin, supplierController.getSupplierById);

/**
 * @route POST /api/suppliers
 * @desc Create a new supplier
 */
router.post("/", VerifyToken, VerifyAdmin, supplierController.createSupplier);

/**
 * @route PUT /api/suppliers/:id
 * @desc Update supplier details
 */
router.put("/:id", VerifyToken, VerifyAdmin, supplierController.updateSupplier);

/**
 * @route DELETE /api/suppliers/:id
 * @desc Delete supplier
 */
router.delete("/:id", VerifyToken, VerifyAdmin, supplierController.deleteSupplier);

/**
 * @route PUT /api/suppliers/:id/status
 * @desc Toggle supplier status (Active/Inactive)
 */
router.put("/:id/status", VerifyToken, VerifyAdmin, supplierController.toggleSupplierStatus);

module.exports = router;
