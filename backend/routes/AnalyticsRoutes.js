const express = require("express");
const router = express.Router();
const analyticsController = require("../controller/AnalyticsController");
const { VerifyToken } = require("../utils/Authentication");

/**
 * @route GET /pharmacy-api/analytics/pharmacy/:pharmacyId/sales
 * @desc Get medicine sales analytics by pharmacy ID
 * @query period - day|month|year|last_month
 * @query year - optional year for filtering
 * @query month - optional month for filtering
 */
router.get("/pharmacy/:pharmacyId/sales", VerifyToken, analyticsController.getMedicineSalesAnalytics);

/**
 * @route GET /pharmacy-api/analytics/pharmacy/:pharmacyId/prescriptions
 * @desc Get prescription analytics by pharmacy ID
 * @query period - day|month|year|last_month
 * @query year - optional year for filtering
 * @query month - optional month for filtering
 */
router.get("/pharmacy/:pharmacyId/prescriptions", VerifyToken, analyticsController.getPrescriptionAnalytics);

/**
 * @route GET /pharmacy-api/analytics/pharmacy/:pharmacyId/prescriptionProcessed
 * @desc Get prescription processed analytics by pharmacy ID
 * @query period - day|month|year|last_month
 * 
 */

router.get("/pharmacy/:pharmacyId/prescriptionProcessed", VerifyToken, analyticsController.getTotalPrescriptionProcessed);

/**
 * @route GET /pharmacy-api/analytics/pharmacy/:pharmacyId/financials
 * @desc Get financial analytics by pharmacy ID
 * @query period - day|month|year|last_month
 */

router.get("/pharmacy/:pharmacyId/financials", VerifyToken, analyticsController.getFinancialAnalytics);

module.exports = router;