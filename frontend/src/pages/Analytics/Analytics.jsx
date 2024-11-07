// Analytics.jsx 
import { useState, useEffect, useRef } from 'react';
import { 
  Box, Container, VStack, HStack, Select, 
  Heading, useToast, Grid, Divider 
} from '@chakra-ui/react';
import axios from 'axios';
import {
  LineChart, Line, BarChart, Bar, XAxis, 
  YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import { useReactToPrint } from 'react-to-print';

const Analytics = () => {
  const [topMedicines, setTopMedicines] = useState([]);
	const [topPrescriptions, setTopPrescriptions] = useState([]);
	const [medicationUsage, setMedicationUsage] = useState([]);
	const [prescriptionTrends, setPrescriptionTrends] = useState([]);
	const [period, setPeriod] = useState("month");
	const [year, setYear] = useState(new Date().getFullYear());
	const [month, setMonth] = useState(new Date().getMonth() + 1);
	const [isLoading, setIsLoading] = useState(true);
	const toast = useToast();
	const pharmacyId = "deffdbce-6c21-4378-be98-60990bdba252";

	const fetchTopData = async () => {
		try {
			const [topMedRes, topPresRes] = await Promise.all([
				axios.get(`/pharmacy-api/analytics/pharmacy/${pharmacyId}/sales`, {
					params: { period: "last_month" },
				}),
				axios.get(`/pharmacy-api/analytics/pharmacy/${pharmacyId}/prescriptions`, {
					params: { period: "last_month" },
				}),
			]);

			setTopMedicines(topMedRes.data.slice(0, 10));
			setTopPrescriptions(topPresRes.data.slice(0, 10));
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
		try {
			setIsLoading(true);
			const [usageRes, trendsRes] = await Promise.all([
				axios.get(`/pharmacy-api/analytics/pharmacy/${pharmacyId}/sales`, {
					params: { period, year, month },
				}),
				axios.get(`/pharmacy-api/analytics/pharmacy/${pharmacyId}/prescriptions`, {
					params: { period, year, month },
				}),
			]);

			setMedicationUsage(usageRes.data);
			setPrescriptionTrends(trendsRes.data);
		} catch (error) {
			toast({
				title: "Error fetching analytics",
				description: error.response?.data?.message || "Something went wrong",
				status: "error",
				duration: 3000,
			});
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
								<Bar dataKey="total" name="Total Sold" fill="var(--secondary)" />
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
							<LineChart data={formatPrescriptionData(prescriptionTrends)}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis />
								<Tooltip />
								<Legend />
								<Line
									type="monotone"
									dataKey="total"
									name="Total Prescriptions"
									stroke="var(--accent)"
									strokeWidth={2}
									dot={{ fill: "var(--accent)" }}
								/>
							</LineChart>
						</ResponsiveContainer>
					</Box>
				</Grid>
			</VStack>
		</Container>
	);
};

export default Analytics;