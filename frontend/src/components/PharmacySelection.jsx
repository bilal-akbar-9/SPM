import { useState, useEffect } from "react";
import { Box, Container, VStack, Heading, Select, useToast, Spinner } from "@chakra-ui/react";
import axios from "axios";
import usePharmacyStore from "../hooks/usePharmacyStore";
import Cookies from "js-cookie";

const PharmacySelection = () => {
	const [isLoading, setIsLoading] = useState(true);
	const toast = useToast();
	const { setPharmacies, setSelectedPharmacy, selectedPharmacy, pharmacies } = usePharmacyStore();

	useEffect(() => {
		fetchPharmacies();
	}, []);

	const fetchPharmacies = async () => {
		try {
			const response = await axios.get("/pharmacy-api/pharmacies", {
				headers: {
					Authorization: `Bearer ${Cookies.get("token")}`, // Note: get() not getItem()
				},
			});

			 // Direct access to response.data since it's already an array
			const pharmaciesData = response.data || [];
			setPharmacies(pharmaciesData);
		} catch (error) {
			console.error("Pharmacy fetch error:", error);
			toast({
				title: "Error fetching pharmacies",
				description: error.response?.data?.message || "Something went wrong",
				status: "error",
				duration: 3000,
			});
			setPharmacies([]); // Set empty array on error
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Box bg="var(--background)" color="var(--text)" className="flex items-center justify-center">
			<Container maxW="100%" py={12}>
				<VStack spacing={8} align="stretch">
					<Heading fontSize={"3xl"}  textAlign="center" color="var(--chakra-primary)">
						Select a Pharmacy
          </Heading>
          
					<Box
						bg="white"
						p={8}
						borderRadius="xl"
						boxShadow="lg"
						className="backdrop-blur-sm bg-white/30">
						<VStack spacing={6}>
							{isLoading ? (
								<Spinner />
							) : (
								<Select
									placeholder="Select a pharmacy"
									value={selectedPharmacy?.pharmacyId || ""}
									onChange={(e) => {
										const selected = pharmacies.find((p) => p.pharmacyId === e.target.value);
										setSelectedPharmacy(selected);
									}}>
									 {pharmacies?.map((pharmacy) => (
										<option key={pharmacy.pharmacyId} value={pharmacy.pharmacyId}>
											{pharmacy.name}
										</option>
									))}
								</Select>
							)}
						</VStack>
					</Box>
				</VStack>
			</Container>
		</Box>
	);
};

export default PharmacySelection;
