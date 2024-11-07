const express = require("express");
const router = express.Router();
const analyticsController = require("../controller/AnalyticsController");

/**
 * @route GET /api/analytics/pharmacy/:pharmacyId/sales
 * @desc Get medicine sales analytics by pharmacy ID
 * @query period - day|month|year|last_month
 * @query year - optional year for filtering
 * @query month - optional month for filtering
 */
router.get("/pharmacy/:pharmacyId/sales", analyticsController.getMedicineSalesAnalytics);

/**
 * @route GET /api/analytics/pharmacy/:pharmacyId/prescriptions
 * @desc Get prescription analytics by pharmacy ID
 * @query period - day|month|year|last_month
 * @query year - optional year for filtering
 * @query month - optional month for filtering
 */
router.get("/pharmacy/:pharmacyId/prescriptions", analyticsController.getPrescriptionAnalytics);

module.exports = router;