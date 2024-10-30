const express = require("express");
const router = express.Router();
const pharmacyController = require("../controller/PharmacyController");

/**
 * @route GET /api/pharmacies
 * @desc Get all pharmacies
 */
router.get("/", pharmacyController.getAllPharmacies);

/**
 * @route GET /api/pharmacies/:id
 * @desc Get pharmacy by ID
 */
router.get("/:id", pharmacyController.getPharmacyById);

/**
 * @route POST /api/pharmacies
 * @desc Create a new pharmacy
 */
router.post("/", pharmacyController.createPharmacy);

/**
 * @route PUT /api/pharmacies/:id
 * @desc Update pharmacy details
 */
router.put("/:id", pharmacyController.updatePharmacy);

/**
 * @route DELETE /api/pharmacies/:id
 * @desc Delete pharmacy
 */
router.delete("/:id", pharmacyController.deletePharmacy);

module.exports = router;