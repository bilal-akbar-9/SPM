const express = require("express");
const router = express.Router();
const medicineController = require("../controller/MedicineController");
const { VerifyToken, VerifyAdmin } = require("../utils/Authentication");

/**
 * @route GET /api/medicines
 * @desc Get all medicines
 */
router.get("/", VerifyToken, VerifyAdmin, medicineController.getAllMedicines);

/**
 * @route GET /api/medicines/:id
 * @desc Get medicine by ID
 */
router.get("/:id", VerifyToken, medicineController.getMedicineById);

/**
 * @route POST /api/medicines
 * @desc Create a new medicine
 */
router.post("/", VerifyToken, VerifyAdmin, medicineController.createMedicine);

/**
 * @route PUT /api/medicines/:id
 * @desc Update medicine details
 */
router.put("/:id", VerifyToken, VerifyAdmin, medicineController.updateMedicine);

/**
 * @route DELETE /api/medicines/:id
 * @desc Delete a medicine
 */
router.delete("/:id", VerifyToken, VerifyAdmin, medicineController.deleteMedicine);

module.exports = router;
