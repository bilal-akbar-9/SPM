const AnalyticsSchema = require("../models/Analytics.schema");

const analyticsController = {
	// Get medicine sales by time period
	getMedicineSalesAnalytics: async (req, res) => {
		try {
			const { period, year, month } = req.query;
			const { pharmacyId } = req.params;
			console.log(req.query);
			
			let matchStage = { pharmacyId };
			let dateField = "$reportDate";

			// Date filtering
			switch(period) {
				case 'day':
					matchStage.reportDate = {
						$gte: new Date(new Date().setHours(0,0,0,0)),
						$lt: new Date(new Date().setHours(23,59,59,999))
					};
					break;
				case 'month':
					matchStage.reportMonth = parseInt(month || new Date().getMonth() + 1);
					matchStage.reportYear = parseInt(year || new Date().getFullYear());
					break;
				case 'year':
					matchStage.reportYear = parseInt(year || new Date().getFullYear());
					break;
				case 'last_month':
					const lastMonth = new Date();
					lastMonth.setMonth(lastMonth.getMonth() - 1);
					matchStage.reportMonth = lastMonth.getMonth() + 1;
					matchStage.reportYear = lastMonth.getFullYear();
					break;
			}

			const analytics = await AnalyticsSchema.aggregate([
				{ $match: matchStage },
				{ $unwind: "$medicationUsageReport" },
				{
					$group: {
						_id: {
							medicationId: "$medicationUsageReport.medicationId",
							...(period === 'month' && { day: { $dayOfMonth: dateField } }),
							...(period === 'year' && { month: "$reportMonth" })
						},
						totalSold: { $sum: "$medicationUsageReport.totalSold" }
					}
				},
				{
					$lookup: {
						from: "medicines",
						localField: "_id.medicationId",
						foreignField: "medicationId",
						as: "medicationDetails"
					}
				},
				{ $unwind: "$medicationDetails" },
				{
					$project: {
						_id: 0,
						medicationName: "$medicationDetails.name",
						totalSold: 1,
						...(period === 'month' && { day: "$_id.day" }),
						...(period === 'year' && { month: "$_id.month" })
					}
				},
				{ $sort: { totalSold: -1 } }
			]);

			if (!analytics.length) {
				return res.status(404).json({
					message: `No sales data found for the specified period`
				});
			}

			res.status(200).json(analytics);
		} catch (error) {
			res.status(500).json({
				message: "Error fetching sales analytics",
				error: error.message
			});
		}
	},

	// Get prescription trends by time period
	getPrescriptionAnalytics: async (req, res) => {
		try {
			const { period, year, month } = req.query;
			const { pharmacyId } = req.params;

			let matchStage = { pharmacyId };
			let dateField = "$reportDate";

			// Similar date filtering as above
			switch(period) {
				case 'day':
					matchStage.reportDate = {
						$gte: new Date(new Date().setHours(0,0,0,0)),
						$lt: new Date(new Date().setHours(23,59,59,999))
					};
					break;
				// Add other cases similar to getMedicineSalesAnalytics
			}

			const analytics = await AnalyticsSchema.aggregate([
				{ $match: matchStage },
				{ $unwind: "$prescriptionTrends" },
				{
					$group: {
						_id: {
							medicationId: "$prescriptionTrends.medicationId",
							...(period === 'month' && { day: { $dayOfMonth: dateField } }),
							...(period === 'year' && { month: "$reportMonth" })
						},
						totalPrescriptions: { $sum: "$prescriptionTrends.totalPrescriptions" }
					}
				},
				{
					$lookup: {
						from: "medicines",
						localField: "_id.medicationId",
						foreignField: "medicationId",
						as: "medicationDetails"
					}
				},
				{ $unwind: "$medicationDetails" },
				{
					$project: {
						_id: 0,
						medicationName: "$medicationDetails.name",
						totalPrescriptions: 1,
						...(period === 'month' && { day: "$_id.day" }),
						...(period === 'year' && { month: "$_id.month" })
					}
				},
				{ $sort: { totalPrescriptions: -1 } }
			]);

			if (!analytics.length) {
				return res.status(404).json({
					message: `No prescription data found for the specified period`
				});
			}

			res.status(200).json(analytics);
		} catch (error) {
			res.status(500).json({
				message: "Error fetching prescription analytics",
				error: error.message
			});
		}
	},
	getTotalPrescriptionProcessed: async (req, res) => {
		try {
			const { period, year, month } = req.query;
			const { pharmacyId } = req.params;

			let matchStage = { pharmacyId };
			let dateField = "$reportDate";

			// Similar date filtering as above
			switch(period) {
				case 'day':
					matchStage.reportDate = {
						$gte: new Date(new Date().setHours(0,0,0,0)),
						$lt: new Date(new Date().setHours(23,59,59,999))
					};
					break;
				// Add other cases similar to getMedicineSalesAnalytics
			}

			const analytics = await AnalyticsSchema.aggregate([
				{ $match: matchStage },
				{
					$group: {
						_id: {
							...(period === 'month' && { day: { $dayOfMonth: dateField } }),
							...(period === 'year' && { month: "$reportMonth" })
						},
						totalPrescriptionsProcessed: { $sum: "$totalPrescriptionsProcessed" }
					}
				},
				{
					$project: {
						_id: 0,
						totalPrescriptionsProcessed: 1,
						...(period === 'month' && { day: "$_id.day" }),
						...(period === 'year' && { month: "$_id.month" })
					}
				},
				{ $sort: { totalPrescriptionsProcessed: -1 } }
			]);

			if (!analytics.length) {
				return res.status(404).json({
					message: `No prescription data found for the specified period`
				});
			}

			res.status(200).json(analytics);
		} catch (error) {
			res.status(500).json({
				message: "Error fetching prescription analytics",
				error: error.message
			});
		}
	}
};

module.exports = analyticsController;
