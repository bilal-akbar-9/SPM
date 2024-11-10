import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Add styles for PDF
const styles = StyleSheet.create({
	page: {
		padding: 30,
	},
	header: {
		fontSize: 24,
		marginBottom: 20,
		textAlign: "center",
	},
	section: {
		margin: 10,
		padding: 10,
	},
	title: {
		fontSize: 18,
		marginBottom: 10,
	},
	text: {
		fontSize: 12,
		marginBottom: 5,
	},
});

// Create PDF Document component
const AnalyticsReport = ({
	pharmacyName,
	staticFinancials,
	dynamicFinancials,
	period,
	month,
	year,
}) => (
	<Document>
		<Page size="A4" style={styles.page}>
			<Text style={styles.header}>{pharmacyName} - Analytics Report</Text>

			<View style={styles.section}>
				<Text style={styles.title}>Static Analytics (Last Month)</Text>
				<Text style={styles.text}>
					Total Sales: Rs. {staticFinancials.totalSales?.toLocaleString()}
				</Text>
				<Text style={styles.text}>
					Total Cost: Rs. {staticFinancials.totalCost?.toLocaleString()}
				</Text>
				<Text style={styles.text}>
					Total Profit: Rs. {staticFinancials.profit?.toLocaleString()}
				</Text>
			</View>

			<View style={styles.section}>
				<Text style={styles.title}>
					Dynamic Analytics (
					{period === "month"
						? `${new Date(0, month - 1).toLocaleString("default", { month: "long" })} ${year}`
						: period === "year"
						? year
						: "Current Period"}
					)
				</Text>
				<Text style={styles.text}>
					Total Sales: Rs. {dynamicFinancials.totalSales?.toLocaleString()}
				</Text>
				<Text style={styles.text}>
					Total Cost: Rs. {dynamicFinancials.totalCost?.toLocaleString()}
				</Text>
				<Text style={styles.text}>
					Total Profit: Rs. {dynamicFinancials.profit?.toLocaleString()}
				</Text>
			</View>
		</Page>
	</Document>
);
