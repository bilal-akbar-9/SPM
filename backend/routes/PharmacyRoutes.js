const express = require("express");
const router = express.Router();
const pharmacyController = require("../controller/PharmacyController");
const { VerifyToken, VerifyAdmin } = require("../utils/Authentication");

/**
 * @route GET /api/pharmacies
 * @desc Get all pharmacies
 */
router.get("/", VerifyToken, VerifyAdmin, pharmacyController.getAllPharmacies);

/**
 * @route GET /api/pharmacies/:id
 * @desc Get pharmacy by ID
 */
router.get("/:id", VerifyToken, pharmacyController.getPharmacyById);

/**
 * @route POST /api/pharmacies
 * @desc Create a new pharmacy
 */
router.post("/", VerifyToken, VerifyAdmin, pharmacyController.createPharmacy);

/**
 * @route PUT /api/pharmacies/:id
 * @desc Update pharmacy details
 */
router.put("/:id", VerifyToken, VerifyAdmin, pharmacyController.updatePharmacy);

/**
 * @route DELETE /api/pharmacies/:id
 * @desc Delete pharmacy
 */
router.delete("/:id", VerifyToken, VerifyAdmin, pharmacyController.deletePharmacy);

module.exports = router;