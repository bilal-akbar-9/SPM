const express = require("express");
const router = express.Router();
const prescriptionController = require("../controller/PrescriptionController");

router.get("/", prescriptionController.getAllPrescriptions);
router.get("/:id", prescriptionController.getPrescriptionById);
router.post("/", prescriptionController.createPrescription);
router.get("/patient/:patientId", prescriptionController.getPatientPrescriptions);
router.get("/patient/:patientId/valid-prescriptions", prescriptionController.getValidPrescriptionsByPatient);
router.get("/:prescriptionId/medicine-details", prescriptionController.getMedicineDetails);
router.patch("/:prescriptionId/status", prescriptionController.updatePrescriptionStatus);

module.exports = router;
