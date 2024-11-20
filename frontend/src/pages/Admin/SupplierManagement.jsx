// SupplierManagement.jsx
import { useState, useEffect } from "react";
import {
	Box,
	Button,
	Container,
	Grid,
	Heading,
	Text,
	useDisclosure,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	FormControl,
	FormLabel,
	FormErrorMessage,
	Input,
	useToast,
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	Badge,
} from "@chakra-ui/react";
import { FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight } from "react-icons/fi";
import axios from "axios";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object({
	name: yup.string().required("Name is required"),
	contactPerson: yup.string().required("Contact person is required"),
	email: yup.string().email("Invalid email").required("Email is required"),
	phone: yup.string().required("Phone is required"),
	address: yup.string().required("Address is required"),
});

const SupplierManagement = () => {
	const [suppliers, setSuppliers] = useState([]);
	const [selectedSupplier, setSelectedSupplier] = useState(null);
	const [supplierToDelete, setSupplierToDelete] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const toast = useToast();

	const { isOpen, onOpen, onClose } = useDisclosure();
	const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		resolver: yupResolver(schema),
	});

	useEffect(() => {
		fetchSuppliers();
	}, []);

	const fetchSuppliers = async () => {
		try {
			const response = await axios.get("/pharmacy-api/suppliers", {
				headers: { Authorization: `Bearer ${Cookies.get("token")}` },
			});
			setSuppliers(response.data);
		} catch (error) {
			toast({
				title: "Error fetching suppliers",
				description: error.response?.data?.message || "Something went wrong",
				status: "error",
				duration: 3000,
			});
		}
	};

	const handleModalOpen = (supplier = null) => {
		if (supplier) {
			reset(supplier);
		} else {
			reset({});
		}
		setSelectedSupplier(supplier);
		onOpen();
	};

	const onSubmit = async (data) => {
		setIsSubmitting(true);
		try {
			if (selectedSupplier) {
				await axios.put(`/pharmacy-api/suppliers/${selectedSupplier.supplierId}`, data, {
					headers: { Authorization: `Bearer ${Cookies.get("token")}` },
				});
			} else {
				await axios.post("/pharmacy-api/suppliers", data, {
					headers: { Authorization: `Bearer ${Cookies.get("token")}` },
				});
			}
			fetchSuppliers();
			onClose();
			toast({
				title: `Supplier ${selectedSupplier ? "updated" : "created"} successfully`,
				status: "success",
				duration: 3000,
			});
		} catch (error) {
			toast({
				title: `Error ${selectedSupplier ? "updating" : "creating"} supplier`,
				description: error.response?.data?.message || "Something went wrong",
				status: "error",
				duration: 3000,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDelete = async () => {
		try {
			await axios.delete(`/pharmacy-api/suppliers/${supplierToDelete.supplierId}`, {
				headers: { Authorization: `Bearer ${Cookies.get("token")}` },
			});
			fetchSuppliers();
			onAlertClose();
			toast({
				title: "Supplier deleted successfully",
				status: "success",
				duration: 3000,
			});
		} catch (error) {
			toast({
				title: "Error deleting supplier",
				description: error.response?.data?.message || "Something went wrong",
				status: "error",
				duration: 3000,
			});
		}
	};

	const toggleStatus = async (supplier) => {
		try {
			await axios.put(
				`/pharmacy-api/suppliers/${supplier.supplierId}/status`,
				{},
				{
					headers: { Authorization: `Bearer ${Cookies.get("token")}` },
				}
			);
			fetchSuppliers();
			toast({
				title: "Supplier status updated successfully",
				status: "success",
				duration: 3000,
			});
		} catch (error) {
			toast({
				title: "Error updating supplier status",
				description: error.response?.data?.message || "Something went wrong",
				status: "error",
				duration: 3000,
			});
		}
	};

	return (
		<Container maxW="container.xl" py={8}>
			<Box className="flex justify-between items-center mb-8">
				<Heading color="var(--text)">Supplier Management</Heading>
				<Button
					leftIcon={<FiPlus />}
					onClick={() => handleModalOpen()}
					backgroundColor="var(--primary)"
					color="white"
					_hover={{ backgroundColor: "var(--button_hover)" }}>
					Add Supplier
				</Button>
			</Box>

			<Grid templateColumns="repeat(auto-fill, minmax(45%, 1fr))" gap={6}>
				{suppliers.map((supplier) => (
					<Box
						key={supplier.supplierId}
						p={6}
						bg="white"
						borderRadius="xl"
						boxShadow="lg"
						position="relative"
						className="transition-all duration-200 hover:shadow-xl hover:transform hover:-translate-y-1">
						<Badge
							position="absolute"
							top={4}
							right={4}
							colorScheme={supplier.status === "Active" ? "green" : "red"}>
							{supplier.status}
						</Badge>

						<Box mb={6} mt={5}>
							<Text fontSize="2xl" fontWeight="bold" color="var(--text)" mb={1}>
								{supplier.name}
							</Text>
							<Text color="gray.500" fontSize="sm" mb={4}>
								Contact: {supplier.contactPerson}
							</Text>

							<Box p={4} bg="gray.50" borderRadius="lg" border="1px" borderColor="gray.100">
								<Text color="gray.600" fontSize="sm" mb={2}>
									<Box as="span" fontWeight="medium">
										Email:
									</Box>{" "}
									{supplier.email}
								</Text>
								<Text color="gray.600" fontSize="sm" mb={2}>
									<Box as="span" fontWeight="medium">
										Phone:
									</Box>{" "}
									{supplier.phone}
								</Text>
								<Text color="gray.600" fontSize="sm">
									<Box as="span" fontWeight="medium">
										Address:
									</Box>{" "}
									{supplier.address}
								</Text>
							</Box>
						</Box>

						<Box className="flex justify-between gap-3" borderTop="1px" borderColor="gray.100" pt={4}>
							<Button
								size="sm"
								leftIcon={supplier.status === "Active" ? <FiToggleRight /> : <FiToggleLeft />}
								onClick={() => toggleStatus(supplier)}
								colorScheme={supplier.status === "Active" ? "green" : "red"}
								variant="outline">
								{supplier.status}
							</Button>
							<Box className="flex gap-3">
								<Button
									size="sm"
									leftIcon={<FiEdit2 />}
									onClick={() => handleModalOpen(supplier)}
									bg="var(--accent)"
									color="white"
									_hover={{ bg: "var(--button_hover)" }}>
									Edit
								</Button>
								<Button
									size="sm"
									leftIcon={<FiTrash2 />}
									onClick={() => {
										setSupplierToDelete(supplier);
										onAlertOpen();
									}}
									variant="outline"
									colorScheme="red">
									Delete
								</Button>
							</Box>
						</Box>
					</Box>
				))}
			</Grid>

			{/* Create/Edit Modal */}
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>{selectedSupplier ? "Edit Supplier" : "Create Supplier"}</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<form onSubmit={handleSubmit(onSubmit)}>
							<FormControl mb={4} isInvalid={!!errors.name}>
								<FormLabel>Name</FormLabel>
								<Input {...register("name")} />
								<FormErrorMessage>{errors.name?.message}</FormErrorMessage>
							</FormControl>

							<FormControl mb={4} isInvalid={!!errors.contactPerson}>
								<FormLabel>Contact Person</FormLabel>
								<Input {...register("contactPerson")} />
								<FormErrorMessage>{errors.contactPerson?.message}</FormErrorMessage>
							</FormControl>

							<FormControl mb={4} isInvalid={!!errors.email}>
								<FormLabel>Email</FormLabel>
								<Input {...register("email")} type="email" />
								<FormErrorMessage>{errors.email?.message}</FormErrorMessage>
							</FormControl>

							<FormControl mb={4} isInvalid={!!errors.phone}>
								<FormLabel>Phone</FormLabel>
								<Input {...register("phone")} />
								<FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
							</FormControl>

							<FormControl mb={4} isInvalid={!!errors.address}>
								<FormLabel>Address</FormLabel>
								<Input {...register("address")} />
								<FormErrorMessage>{errors.address?.message}</FormErrorMessage>
							</FormControl>

							<Button type="submit" colorScheme="blue" mr={3} w="full" isLoading={isSubmitting}>
								{selectedSupplier ? "Update" : "Create"}
							</Button>
						</form>
					</ModalBody>
				</ModalContent>
			</Modal>

			{/* Delete Alert */}
			<AlertDialog isOpen={isAlertOpen} onClose={onAlertClose}>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader>Delete Supplier</AlertDialogHeader>
						<AlertDialogBody>
							Are you sure you want to delete {supplierToDelete?.name}? This action cannot be
							undone.
						</AlertDialogBody>
						<AlertDialogFooter>
							<Button onClick={onAlertClose}>Cancel</Button>
							<Button colorScheme="red" ml={3} onClick={handleDelete}>
								Delete
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</Container>
	);
};

export default SupplierManagement;
