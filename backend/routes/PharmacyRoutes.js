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

// PharmacyRoutes.js - Add new routes
/**
 * @route POST /api/pharmacies/:id/feedback
 * @desc Add customer feedback for pharmacy
 */
router.post("/:id/feedback", VerifyToken, pharmacyController.addFeedback);

/**
 * @route GET /api/pharmacies/:id/feedback
 * @desc Get all feedback for pharmacy
 */
router.get("/:id/feedback", VerifyToken, pharmacyController.getFeedback);

/**
 * @route GET /api/pharmacies/:id/feedback/:prescriptionId
 * @desc Get feedback for prescription
 */
router.get("/:id/feedback/:prescriptionId", VerifyToken, pharmacyController.getFeedbackByPrescriptionId);

module.exports = router;