import React, { useEffect, useState } from "react";
import {
	Box,
	Heading,
	Text,
	Spinner,
	useToast,
	Button,
	VStack,
	HStack,
	Badge,
	Divider,
	Container,
	SimpleGrid,
	Icon,
} from "@chakra-ui/react";
import { FiPackage, FiEdit2, FiCalendar, FiDollarSign } from "react-icons/fi";
import axios from "axios";

const InventoryPage = () => {
	const [inventory, setInventory] = useState([]);
	const [loading, setLoading] = useState(true);
	const toast = useToast();

	// Fetch inventory from API
	const fetchInventory = async () => {
		try {
			const response = await axios.get("/pharmacy-api/inventoryservices/");
			setInventory(response.data);
			setLoading(false);
		} catch (error) {
			console.error("Error fetching inventory:", error);
			toast({
				title: "Error fetching inventory.",
				description: "Please try again later.",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
			setLoading(false);
		}
	};

	// Update quantity handler
	const handleUpdateQuantity = async (pharmacyId, medicationId) => {
		const newQuantity = prompt("Enter the new quantity:");

		// Check if the user canceled the prompt
		if (newQuantity === null || newQuantity.trim() === "") {
			return; // Do nothing if the prompt was canceled or input is empty
		}

		if (isNaN(newQuantity) || Number(newQuantity) < 0) {
			toast({
				title: "Invalid quantity.",
				description: "Please enter a valid number.",
				status: "warning",
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		try {
			await axios.put(`/pharmacy-api/inventoryservices/${pharmacyId}/update`, {
				medicationId,
				quantity: Number(newQuantity),
			});
			toast({
				title: "Quantity updated.",
				description: "The inventory has been successfully updated.",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
			fetchInventory(); 
		} catch (error) {
			console.error("Error updating quantity:", error);
			toast({
				title: "Error updating quantity.",
				description: "Please try again later.",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		}
	};

  //fetching inventory

	useEffect(() => {
		fetchInventory();
	}, []);

	if (loading) {
		return (
			<Box className="flex justify-center items-center h-screen bg-background">
				<Spinner size="xl" color="var(--chakra-primary)" />
			</Box>
		);
	}
	return (
		<Container maxW="container.xl" py={8}>
			<VStack spacing={8} align="stretch">
				<HStack justify="space-between">
					<Heading color="var(--text)" fontSize="3xl" fontWeight="bold">
						Inventory Management
					</Heading>
					<Button
						leftIcon={<FiPackage />}
						bg="var(--primary)"
						color="white"
						px={6}
						h={12}
						_hover={{ bg: "var(--button_hover)", transform: "translateY(-2px)" }}
						transition="all 0.2s"
						boxShadow="md"
						rounded="lg">
						Add New Inventory
					</Button>
				</HStack>

				<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
					{inventory.map((item) => (
						<Box
							key={item.pharmacyId}
							bg="white"
							p={6}
							rounded="xl"
							boxShadow="lg"
							transition="all 0.2s"
							_hover={{ transform: "translateY(-4px)", boxShadow: "xl" }}>
							<VStack align="stretch" spacing={4}>
								<HStack justify="space-between">
									<Badge colorScheme="blue" px={3} py={1} rounded="full">
										Pharmacy #{item.pharmacyId.slice(-4)}
									</Badge>
								</HStack>

								<Divider />

								<VStack align="stretch" spacing={4}>
									{item.medications.map((medication, index) => (
										<Box
											key={index}
											p={4}
											bg="gray.50"
											rounded="lg"
											borderWidth="1px"
											borderColor="gray.100">
											<VStack align="stretch" spacing={2}>
												<Heading size="md" color="var(--text)">
													{medication.medication.name}
												</Heading>

												<SimpleGrid columns={2} spacing={4}>
													<HStack>
														<Icon as={FiPackage} color="var(--accent)" />
														<Text color="gray.600">Qty: {medication.quantity}</Text>
													</HStack>

													<HStack>
														<Icon as={FiDollarSign} color="var(--accent)" />
														<Text color="gray.600">${medication.medication.price.toFixed(2)}</Text>
													</HStack>

													<HStack>
														<Icon as={FiCalendar} color="var(--accent)" />
														<Text color="gray.600">
															Exp: {new Date(medication.expirationDate).toLocaleDateString()}
														</Text>
													</HStack>
												</SimpleGrid>

												<Text color="gray.500" fontSize="sm">
													{medication.medication.manufacturer}
												</Text>

												<Button
													leftIcon={<FiEdit2 />}
													size="sm"
													w="full"
													variant="outline"
													colorScheme="blue"
													onClick={() =>
														handleUpdateQuantity(item.pharmacyId, medication.medication._id)
													}
													_hover={{
														bg: "var(--primary)",
														color: "white",
													}}>
													Update Quantity
												</Button>
											</VStack>
										</Box>
									))}
								</VStack>
							</VStack>
						</Box>
					))}
				</SimpleGrid>
			</VStack>

			{loading && (
				<Box
					position="fixed"
					top={0}
					left={0}
					right={0}
					bottom={0}
					bg="blackAlpha.300"
					display="flex"
					alignItems="center"
					justifyContent="center"
					zIndex={999}>
					<Spinner
						thickness="4px"
						speed="0.65s"
						emptyColor="gray.200"
						color="var(--primary)"
						size="xl"
					/>
				</Box>
			)}
		</Container>
	);
};

export default InventoryPage;