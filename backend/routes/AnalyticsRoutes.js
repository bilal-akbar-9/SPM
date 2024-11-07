const express = require("express");
const router = express.Router();

// Controllers
const analyticsController = require("../controller/AnalyticsController");

// Routes
/**
 * @route GET /api/analytics
 * @desc Get all analytics data
 */
router.get("/", analyticsController.getAllAnalytics);

/**
 * @route GET /api/analytics/medication-usage
 * @desc Get medication usage reports
 */
router.get("/medication-usage", analyticsController.getMedicationUsageReport);

/**
 * @route GET /api/analytics/prescription-trends
 * @desc Get prescription trends
 */
router.get("/prescription-trends", analyticsController.getPrescriptionTrends);

/**
 * @route GET /api/analytics/date-range
 * @desc Get analytics by date range using query params startDate and endDate
 */
router.get("/date-range", analyticsController.getAnalyticsByDateRange);

// Export
module.exports = router;