const AnalyticsSchema = require("../models/Analytics.schema");

const analyticsController = {
	// Get medicine sales by time period
	getMedicineSalesAnalytics: async (req, res) => {
		try {
			const { period, year, month } = req.query;
			const { pharmacyId } = req.params;

			let matchStage = { pharmacyId };
			let dateField = "$reportDate";

			// Date filtering
			switch (period) {
				case "day":
					matchStage.reportDate = {
						$gte: new Date(new Date().setHours(0, 0, 0, 0)),
						$lt: new Date(new Date().setHours(23, 59, 59, 999)),
					};
					break;
				case "month":
					matchStage.reportMonth = parseInt(month || new Date().getMonth() + 1);
					matchStage.reportYear = parseInt(year || new Date().getFullYear());
					break;
				case "year":
					matchStage.reportYear = parseInt(year || new Date().getFullYear());
					break;
				case "last_month":
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
							...(period === "month" && { day: { $dayOfMonth: dateField } }),
							...(period === "year" && { month: "$reportMonth" }),
						},
						totalSold: { $sum: "$medicationUsageReport.totalSold" },
					},
				},
				{
					$lookup: {
						from: "medicines",
						localField: "_id.medicationId",
						foreignField: "medicationId",
						as: "medicationDetails",
					},
				},
				{ $unwind: "$medicationDetails" },
				{
					$project: {
						_id: 0,
						medicationName: "$medicationDetails.name",
						totalSold: 1,
						...(period === "month" && { day: "$_id.day" }),
						...(period === "year" && { month: "$_id.month" }),
					},
				},
				{ $sort: { totalSold: -1 } },
			]);

			if (!analytics.length) {
				return res.status(404).json({
					message: `No sales data found for the specified period`,
				});
			}

			res.status(200).json(analytics);
		} catch (error) {
			res.status(500).json({
				message: "Error fetching sales analytics",
				error: error.message,
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
			switch (period) {
				case "day":
					matchStage.reportDate = {
						$gte: new Date(new Date().setHours(0, 0, 0, 0)),
						$lt: new Date(new Date().setHours(23, 59, 59, 999)),
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
							...(period === "month" && { day: { $dayOfMonth: dateField } }),
							...(period === "year" && { month: "$reportMonth" }),
						},
						totalPrescriptions: { $sum: "$prescriptionTrends.totalPrescriptions" },
					},
				},
				{
					$lookup: {
						from: "medicines",
						localField: "_id.medicationId",
						foreignField: "medicationId",
						as: "medicationDetails",
					},
				},
				{ $unwind: "$medicationDetails" },
				{
					$project: {
						_id: 0,
						medicationName: "$medicationDetails.name",
						totalPrescriptions: 1,
						...(period === "month" && { day: "$_id.day" }),
						...(period === "year" && { month: "$_id.month" }),
					},
				},
				{ $sort: { totalPrescriptions: -1 } },
			]);

			if (!analytics.length) {
				return res.status(200).json([]); // Return empty array instead of 404
			}

			res.status(200).json(analytics);
		} catch (error) {
			res.status(500).json({
				message: "Error fetching prescription analytics",
				error: error.message,
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
			switch (period) {
				case "day":
					matchStage.reportDate = {
						$gte: new Date(new Date().setHours(0, 0, 0, 0)),
						$lt: new Date(new Date().setHours(23, 59, 59, 999)),
					};
					break;
				case "month":
					matchStage.reportMonth = parseInt(month || new Date().getMonth() + 1);
					matchStage.reportYear = parseInt(year || new Date().getFullYear());
					break;
				case "year":
					matchStage.reportYear = parseInt(year || new Date().getFullYear());
					break;
				case "last_month":
					const lastMonth = new Date();
					lastMonth.setMonth(lastMonth.getMonth() - 1);
					matchStage.reportMonth = lastMonth.getMonth() + 1;
					matchStage.reportYear = lastMonth.getFullYear();
					break;
			}

			const analytics = await AnalyticsSchema.aggregate([
				{ $match: matchStage },
				{
					$group: {
						_id: {
							...(period === "month" && { day: { $dayOfMonth: dateField } }),
							...(period === "year" && { month: "$reportMonth" }),
						},
						totalPrescriptionsProcessed: { $sum: "$totalPrescriptionsProcessed" },
					},
				},
				{
					$project: {
						_id: 0,
						totalPrescriptionsProcessed: 1,
						...(period === "month" && { day: "$_id.day" }),
						...(period === "year" && { month: "$_id.month" }),
					},
				},
			]);

			if (!analytics.length) {
				return res.status(200).json([]); // Return empty array instead of 404
			}
			res.status(200).json(analytics);
		} catch (error) {
			res.status(500).json({
				message: "Error fetching prescription analytics",
				error: error.message,
			});
		}
	},

	getFinancialAnalytics: async (req, res) => {
		try {
			const { period, year, month } = req.query;
			const { pharmacyId } = req.params;

			// Current period match stage (existing code)
			let currentMatch = { pharmacyId };
			let dateField = "$reportDate";

			// Previous period match stages
			let prevMonthMatch = { pharmacyId };
			let prevYearMatch = { pharmacyId };

			switch (period) {
				case "day":
					currentMatch.reportDate = {
						$gte: new Date(new Date().setHours(0, 0, 0, 0)),
						$lt: new Date(new Date().setHours(23, 59, 59, 999)),
					};
					break;
				case "month":
					const currMonth = parseInt(month || new Date().getMonth() + 1);
					const currYear = parseInt(year || new Date().getFullYear());

					currentMatch.reportMonth = currMonth;
					currentMatch.reportYear = currYear;

					// Previous month
					prevMonthMatch.reportMonth = currMonth - 1 || 12;
					prevMonthMatch.reportYear = currMonth === 1 ? currYear - 1 : currYear;

					// Previous year
					prevYearMatch.reportMonth = currMonth;
					prevYearMatch.reportYear = currYear - 1;
					break;
				case "year":
					const selectedYear = parseInt(year || new Date().getFullYear());
					currentMatch.reportYear = selectedYear;
					prevYearMatch.reportYear = selectedYear - 1;
					break;
				case "last_month":
					const lastMonth = new Date();
					lastMonth.setMonth(lastMonth.getMonth() - 1);
					currentMatch.reportMonth = lastMonth.getMonth() + 1;
					currentMatch.reportYear = lastMonth.getFullYear();
					break;
			}

			const analytics = await AnalyticsSchema.aggregate([
				{
					$facet: {
						current: [
							{ $match: currentMatch },
							{ $unwind: "$medicationUsageReport" },
							{
								$lookup: {
									from: "medicines",
									localField: "medicationUsageReport.medicationId",
									foreignField: "medicationId",
									as: "medicineDetails",
								},
							},
							{ $unwind: "$medicineDetails" },
							{
								$group: {
									_id: {
										...(period === "month" && { day: { $dayOfMonth: dateField } }),
										...(period === "year" && { month: "$reportMonth" }),
									},
									totalSales: {
										$sum: {
											$multiply: ["$medicationUsageReport.totalSold", "$medicineDetails.price"],
										},
									},
									totalCost: {
										$sum: {
											$multiply: [
												"$medicationUsageReport.totalSold",
												"$medicineDetails.purchasePrice",
											],
										},
									},
								},
							},
							{
								$project: {
									_id: 0,
									date: {
										$cond: {
											if: { $eq: [period, "year"] },
											then: { $toString: "$_id.month" },
											else: { $toString: "$_id.day" },
										},
									},
									totalSales: 1,
									totalCost: 1,
									profit: { $subtract: ["$totalSales", "$totalCost"] },
								},
							},
							{ $sort: { date: 1 } },
						],
						previousMonth: [
							{ $match: prevMonthMatch },
							{ $unwind: "$medicationUsageReport" },
							{
								$lookup: {
									from: "medicines",
									localField: "medicationUsageReport.medicationId",
									foreignField: "medicationId",
									as: "medicineDetails",
								},
							},
							{ $unwind: "$medicineDetails" },
							{
								$group: {
									_id: null,
									totalSales: {
										$sum: {
											$multiply: ["$medicationUsageReport.totalSold", "$medicineDetails.price"],
										},
									},
									totalCost: {
										$sum: {
											$multiply: [
												"$medicationUsageReport.totalSold",
												"$medicineDetails.purchasePrice",
											],
										},
									},
								},
							},
							{
								$project: {
									_id: 0,
									totalSales: 1,
									totalCost: 1,
									profit: { $subtract: ["$totalSales", "$totalCost"] },
								},
							},
						],
						previousYear: [
							{ $match: prevYearMatch },
							{ $unwind: "$medicationUsageReport" },
							{
								$lookup: {
									from: "medicines",
									localField: "medicationUsageReport.medicationId",
									foreignField: "medicationId",
									as: "medicineDetails",
								},
							},
							{ $unwind: "$medicineDetails" },
							{
								$group: {
									_id: null,
									totalSales: {
										$sum: {
											$multiply: ["$medicationUsageReport.totalSold", "$medicineDetails.price"],
										},
									},
									totalCost: {
										$sum: {
											$multiply: [
												"$medicationUsageReport.totalSold",
												"$medicineDetails.purchasePrice",
											],
										},
									},
								},
							},
							{
								$project: {
									_id: 0,
									totalSales: 1,
									totalCost: 1,
									profit: { $subtract: ["$totalSales", "$totalCost"] },
								},
							},
						],
						medicineWiseSales: [
							{ $match: currentMatch },
							{ $unwind: "$medicationUsageReport" },
							{
								$lookup: {
									from: "medicines",
									localField: "medicationUsageReport.medicationId",
									foreignField: "medicationId",
									as: "medicineDetails",
								},
							},
							{ $unwind: "$medicineDetails" },
							{
								$group: {
									_id: "$medicineDetails.name",
									totalSales: {
										$sum: {
											$multiply: ["$medicationUsageReport.totalSold", "$medicineDetails.price"],
										},
									},
								},
							},
							{
								$project: {
									name: "$_id",
									value: "$totalSales",
									_id: 0,
								},
							},
							{ $sort: { value: -1 } },
							{ $limit: 10 }, // Top 10 medicines
						],
					},
				},
			]);

			const result = {
				current: analytics[0].current,
				previousMonth: analytics[0].previousMonth[0] || { totalSales: 0, totalCost: 0, profit: 0 },
				previousYear: analytics[0].previousYear[0] || { totalSales: 0, totalCost: 0, profit: 0 },
				medicineWiseSales: analytics[0].medicineWiseSales || [],
			};

			res.status(200).json(result);
		} catch (error) {
			res.status(500).json({
				message: "Error fetching financial analytics",
				error: error.message,
			});
		}
	},
};

module.exports = analyticsController;
