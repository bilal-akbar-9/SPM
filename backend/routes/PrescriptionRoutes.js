const express = require("express");
const router = express.Router();

// Controllers
const prescriptionController = require("../controller/PrescriptionController");

// Routes
/**
 * @route GET /api/prescriptions
 * @desc Get all prescriptions
 */
router.get("/", prescriptionController.getAllPrescriptions);

/**
 * @route GET /api/prescriptions/:id
 * @desc Get prescription by ID
 */
router.get("/:id", prescriptionController.getPrescriptionById);

/**
 * @route POST /api/prescriptions
 * @desc Create a new prescription
 */
router.post("/", prescriptionController.createPrescription);

/**
 * @route GET /api/prescriptions/patient/:patientId
 * @desc Get prescriptions by patient ID
 */
router.get("/patient/:patientId", prescriptionController.getPatientPrescriptions);

module.exports = router;