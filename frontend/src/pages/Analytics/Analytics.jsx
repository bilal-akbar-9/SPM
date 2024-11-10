// Analytics.jsx
import { useState, useEffect, useRef } from "react";
import {
	Box,
	Container,
	VStack,
	HStack,
	Select,
	Heading,
	useToast,
	Grid,
	Divider,
	Text,
} from "@chakra-ui/react";
import axios from "axios";
import {
	BarChart,
	Bar,
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import { useReactToPrint } from "react-to-print";

const Analytics = () => {
	const [staticFinancials, setStaticFinancials] = useState({});
	const [dynamicFinancials, setDynamicFinancials] = useState({});

	const [topMedicines, setTopMedicines] = useState([]);
	const [topMonthlyPrescriptions, setTopMonthlyPrescriptions] = useState([]);
	const [topPrescriptions, setTopPrescriptions] = useState([]);

	const [prescriptionProcessed, setPrescriptionProcessed] = useState([]);
	const [medicationUsage, setMedicationUsage] = useState([]);
	const [prescriptionTrends, setPrescriptionTrends] = useState([]);
	const [period, setPeriod] = useState("month");
	const [year, setYear] = useState(new Date().getFullYear());
	const [month, setMonth] = useState(new Date().getMonth() + 1);
	const [isLoading, setIsLoading] = useState(true);
	const toast = useToast();
	const pharmacyId = "deffdbce-6c21-4378-be98-60990bdba252";

	const fetchTopData = async () => {
		const currentMonth = new Date();
		try {
			const currentDate = new Date();
			const [topMedRes, topPresRes, prescProcRes, staticFinRes] = await Promise.all([
				axios.get(`/pharmacy-api/analytics/pharmacy/${pharmacyId}/sales`, {
					params: { period: "last_month" },
				}),
				axios.get(`/pharmacy-api/analytics/pharmacy/${pharmacyId}/prescriptions`, {
					params: { period: "last_month" },
				}),
				axios.get(`/pharmacy-api/analytics/pharmacy/${pharmacyId}/prescriptionProcessed`, {
					params: { period: "year", year: currentDate.getFullYear() },
				}),
				axios.get(`/pharmacy-api/analytics/pharmacy/${pharmacyId}/financials`, {
					params: { period: "month", year: currentMonth.getFullYear(), month: currentMonth.getMonth() + 1 },
				}),
			]);

			// Data comes pre-sorted from backend, just slice top 10
			setTopMedicines(topMedRes.data.slice(0, 10));
			setTopPrescriptions(topPresRes.data.slice(0, 10));
			setTopMonthlyPrescriptions(
				prescProcRes.data
					.sort((a, b) => b.totalPrescriptionsProcessed - a.totalPrescriptionsProcessed)
					.slice(0, 10)
			);
			setStaticFinancials(calculateFinancialMetrics(staticFinRes.data));
		} catch (error) {
			toast({
				title: "Error fetching top charts",
				description: error.response?.data?.message || "Something went wrong",
				status: "error",
				duration: 3000,
			});
		}
	};

	const fetchData = async () => {
		// Analytics.jsx
		setIsLoading(true);
		try {
			const [usageRes, trendsRes, prescRes, financialRes] = await Promise.all([
				axios
					.get(`/pharmacy-api/analytics/pharmacy/${pharmacyId}/sales`, {
						params: { period, year, month },
					})
					.catch(() => ({ data: [] })), // Return empty array on error

				axios
					.get(`/pharmacy-api/analytics/pharmacy/${pharmacyId}/prescriptions`, {
						params: { period, year, month },
					})
					.catch(() => ({ data: [] })),

				axios
					.get(`/pharmacy-api/analytics/pharmacy/${pharmacyId}/prescriptionProcessed`, {
						params: { period, year, month },
					})
					.catch(() => ({ data: [] })),
				axios
					.get(`/pharmacy-api/analytics/pharmacy/${pharmacyId}/financials`, {
						params: { period, year, month },
					})
					.catch(() => ({ data: [] })),
			]);

			// Set data even if some calls failed
			setMedicationUsage(usageRes.data);
			setPrescriptionTrends(trendsRes.data);
			setPrescriptionProcessed(prescRes.data);
			setDynamicFinancials(calculateFinancialMetrics(financialRes.data));
		} catch (error) {
			console.error("Error fetching analytics:", error);
			// Optionally show error message to user
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchTopData();
	}, []);

	useEffect(() => {
		fetchData();
	}, [period, year, month]);

	const formatMedicationData = (data) => {
		return data.map((item) => ({
			name: item.medicationName,
			total: item.totalSold,
			...(item.day && { day: item.day }),
			...(item.month && { month: item.month }),
		}));
	};

	const formatPrescriptionData = (data) => {
		return data.map((item) => ({
			name: item.medicationName,
			total: item.totalPrescriptions,
			...(item.day && { day: item.day }),
			...(item.month && { month: item.month }),
		}));
	};

	const formatPrescriptionProcessed = (data) => {
		if (!data.length) return [];

		const lastMonth = new Date();
		lastMonth.setMonth(lastMonth.getMonth() - 1);

		return data.map((item) => ({
			date:
				period === "year"
					? `${new Date(0, item.month - 1).toLocaleString("default", { month: "short" })} ${year}`
					: period === "month"
					? `Day ${item.day || 0}`
					: period === "last_month"
					? `${new Date(0, lastMonth.getMonth()).toLocaleString("default", { month: "short" })}` // Remove day
					: new Date(item.reportDate).toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
					  }),
			total: item.totalPrescriptionsProcessed,
		}));
	};

	// New static formatter
	const formatStaticPrescriptionProcessed = (data) => {
		if (!data.length) return [];
		return data.map((item) => ({
			date: `${new Date(0, item.month - 1).toLocaleString("default", { month: "short" })}`,
			total: item.totalPrescriptionsProcessed,
		}));
	};

	const calculateFinancialMetrics = (data) => {
		if (!data?.current?.length) return {};
		const currentPeriod = data.current[0];

		// Calculate metrics
		const metrics = {
			totalSales: currentPeriod.totalSales || 0,
			totalCost: currentPeriod.totalCost || 0,
			// Calculate profit if not provided
			profit: currentPeriod.profit || currentPeriod.totalSales - currentPeriod.totalCost || 0,
			previousMonth: data.previousMonth,
			previousYear: data.previousYear,
		};

		return metrics;
	};

	const calculatePercentageChange = (data, comparison, metricType) => {
		if (!data || !data[`previous${comparison === "month" ? "Month" : "Year"}`]) return 0;

		const metric = metricType === "Profit" ? data.profit : data[`total${metricType}`];

		const previousMetric =
			metricType === "Profit"
				? data[`previous${comparison === "month" ? "Month" : "Year"}`].profit
				: data[`previous${comparison === "month" ? "Month" : "Year"}`][`total${metricType}`];

		if (!previousMetric) return 0;
		const percentageChange = ((metric - previousMetric) / previousMetric) * 100;
		return percentageChange.toFixed(2);
	};
	return (
		<Container maxW="container.xl">
			<VStack spacing={8} align="stretch">
				{/* Top Static Charts */}
				<Grid templateColumns="repeat(2, 1fr)" gap={6}>
					<Box bg="white" p={6} borderRadius="xl" boxShadow="lg">
						<Heading size="md" mb={4}>
							Top 10 Medicines Sold (Last Month)
						</Heading>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={formatMedicationData(topMedicines)}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis />
								<Tooltip />
								<Legend />
								<Bar dataKey="total" name="Total Sold" fill="var(--button_hover)" />
							</BarChart>
						</ResponsiveContainer>
					</Box>

					<Box bg="white" p={6} borderRadius="xl" boxShadow="lg">
						<Heading size="md" mb={4}>
							Top 10 Prescribed Medicines (Last Month)
						</Heading>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={formatPrescriptionData(topPrescriptions)}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis />
								<Tooltip />
								<Legend />
								<Bar dataKey="total" name="Total Prescriptions" fill="var(--accent)" />
							</BarChart>
						</ResponsiveContainer>
					</Box>

					<Box bg="white" p={6} borderRadius="xl" boxShadow="lg" gridColumn="span 2">
						<Heading size="md" mb={4}>
							Highest Prescription Processing Month
						</Heading>
						<ResponsiveContainer width="100%" height={300}>
							<AreaChart data={formatStaticPrescriptionProcessed(topMonthlyPrescriptions)}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="date" />
								<YAxis />
								<Tooltip />
								<Legend />
								<Area
									type="monotone"
									dataKey="total"
									name="Prescriptions Processed"
									fill="var(--primary)"
									fillOpacity={0.3}
									stroke="var(--accent)"
									strokeWidth={2}
								/>
							</AreaChart>
						</ResponsiveContainer>
					</Box>
				</Grid>
				<Grid templateColumns="repeat(3, 1fr)" gap={6} gridColumn="span 2">
					{["Sales", "Cost", "Profit"].map((metric) => (
						<Box key={metric} bg="white" p={6} borderRadius="xl" boxShadow="lg" textAlign="center">
							<Heading size="md" mb={4}>
								Total {metric}
							</Heading>
							<Heading size="xl" color="var(--accent)" mb={2}>
								Rs.{" "}
								{(metric === "Profit"
									? staticFinancials.profit
									: staticFinancials[`total${metric}`]
								)?.toLocaleString() || 0}
							</Heading>
							<Text
								fontSize="sm"
								color={
									parseFloat(calculatePercentageChange(staticFinancials, "month", metric)) >= 0
										? "green.500"
										: "red.500"
								}>
								vs Prev Month: {calculatePercentageChange(staticFinancials, "month", metric)}%
							</Text>
							<Text
								fontSize="sm"
								color={
									parseFloat(calculatePercentageChange(staticFinancials, "year", metric)) >= 0
										? "green.500"
										: "red.500"
								}>
								vs Prev Year: {calculatePercentageChange(staticFinancials, "year", metric)}%
							</Text>
						</Box>
					))}
				</Grid>

				{/* Divider */}
				<Divider my={8} />
				<HStack justify="space-between">
					<Heading color="var(--text)">Analytics Dashboard</Heading>
					<HStack>
						<Select value={period} onChange={(e) => setPeriod(e.target.value)} w="150px">
							<option value="day">Daily</option>
							<option value="month">Monthly</option>
							<option value="year">Yearly</option>
							<option value="last_month">Last Month</option>
						</Select>
						{period === "month" && (
							<Select value={month} onChange={(e) => setMonth(e.target.value)} w="100px">
								{Array.from({ length: 12 }, (_, i) => (
									<option key={i + 1} value={i + 1}>
										{new Date(0, i).toLocaleString("default", { month: "short" })}
									</option>
								))}
							</Select>
						)}
						{(period === "month" || period === "year") && (
							<Select value={year} onChange={(e) => setYear(e.target.value)} w="100px">
								{Array.from({ length: 4 }, (_, i) => {
									const year = new Date().getFullYear() - i;
									return (
										<option key={year} value={year}>
											{year}
										</option>
									);
								})}
							</Select>
						)}
					</HStack>
				</HStack>

				<Grid templateColumns="repeat(2, 1fr)" gap={6}>
					<Box bg="white" p={6} borderRadius="xl" boxShadow="lg">
						<Heading size="md" mb={4}>
							Medication Sales
						</Heading>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={formatMedicationData(medicationUsage)}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis />
								<Tooltip />
								<Legend />
								<Bar dataKey="total" name="Total Sold" fill="var(--primary)" />
							</BarChart>
						</ResponsiveContainer>
					</Box>

					<Box bg="white" p={6} borderRadius="xl" boxShadow="lg">
						<Heading size="md" mb={4}>
							Prescription Trends
						</Heading>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={formatPrescriptionData(prescriptionTrends)}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis />
								<Tooltip />
								<Legend />
								<Bar
									dataKey="total"
									name="Total Prescriptions"
									stroke="var(--accent)"
									fill="var(--primary)"
								/>
							</BarChart>
						</ResponsiveContainer>
					</Box>

					<Box bg="white" p={6} borderRadius="xl" boxShadow="lg" gridColumn="span 2">
						<Heading size="md" mb={4}>
							Prescriptions Processed Over Time
						</Heading>
						<ResponsiveContainer width="100%" height={300}>
							<AreaChart data={formatPrescriptionProcessed(prescriptionProcessed)}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="date" />
								<YAxis />
								<Tooltip />
								<Legend />
								<Area
									type="monotone"
									dataKey="total"
									name="Prescriptions Processed"
									fill="var(--primary)"
									fillOpacity={0.3}
									stroke="var(--accent)"
									strokeWidth={2}
								/>
							</AreaChart>
						</ResponsiveContainer>
					</Box>

					<Grid templateColumns="repeat(3, 1fr)" gap={6} gridColumn="span 2">
						{["Sales", "Cost", "Profit"].map((metric) => (
							<Box
								key={metric}
								bg="white"
								p={6}
								borderRadius="xl"
								boxShadow="lg"
								textAlign="center">
								<Heading size="md" mb={4}>
									Total {metric}
								</Heading>
								<Heading size="xl" color="var(--accent)">
									Rs.{" "}
									{(metric === "Profit"
										? dynamicFinancials.profit
										: dynamicFinancials[`total${metric}`]
									)?.toLocaleString() || 0}
								</Heading>
								<Text
									fontSize="sm"
									color={
										parseFloat(calculatePercentageChange(dynamicFinancials, "month", metric)) >= 0
											? "green.500"
											: "red.500"
									}>
									vs Prev Month: {calculatePercentageChange(dynamicFinancials, "month", metric)}%
								</Text>
								<Text
									fontSize="sm"
									color={
										parseFloat(calculatePercentageChange(dynamicFinancials, "year", metric)) >= 0
											? "green.500"
											: "red.500"
									}>
									vs Prev Year: {calculatePercentageChange(dynamicFinancials, "year", metric)}%
								</Text>
							</Box>
						))}
					</Grid>
				</Grid>
			</VStack>
		</Container>
	);
};

export default Analytics;
