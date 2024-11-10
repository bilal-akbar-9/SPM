// UserManagement.jsx
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
	Select,
	useToast,
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
} from "@chakra-ui/react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import Cookies from "js-cookie";
import usePharmacyStore from "../../../hooks/usePharmacyStore";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Update schema to handle pharmacyId correctly
const schema = yup.object({
	username: yup.string().required("Username is required"),
	password: yup.string().when("$isEditing", {
		is: true,
		then: (schema) => schema.optional(),
		otherwise: (schema) => schema.required("Password is required"),
	}),
	name: yup.string().required("Name is required"),
	role: yup.string().required("Role is required"),
	pharmacyId: yup.string().required("Pharmacy is required"),
});

const UserManagement = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { pharmacies, fetchPharmacies } = usePharmacyStore();
	const toast = useToast();
	const [selectedUser, setSelectedUser] = useState(null);	

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		resolver: yupResolver(schema),
		context: {
			isEditing: !!selectedUser,
		},
		defaultValues: {
			password: "",
		},
	});

	const [users, setUsers] = useState([]);

	const [userToDelete, setUserToDelete] = useState(null);

	const { isOpen, onOpen, onClose } = useDisclosure();
	const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();

	useEffect(() => {
		if (selectedUser) {
			reset({
				username: selectedUser.username,
				name: selectedUser.name,
				role: selectedUser.role,
				pharmacyId: selectedUser.pharmacyId?.pharmacyId || "", // Extract pharmacyId string
			});
		} else {
			reset({});
		}
	}, [selectedUser, reset]);

	useEffect(() => {
		fetchUsers();
		fetchPharmacies();
	}, []);

	const fetchUsers = async () => {
		try {
			const response = await axios.get("/pharmacy-api/users/", {
				headers: { Authorization: `Bearer ${Cookies.get("token")}` },
			});
			setUsers(response.data);
		} catch (error) {
			toast({
				title: "Error fetching users",
				description: error.response?.data?.message || "Something went wrong",
				status: "error",
				duration: 3000,
			});
		}
	};

	// Add form reset function
	const handleFormReset = () => {
		reset({
			username: "",
			password: "",
			name: "",
			role: "user",
			pharmacyId: "",
		});
	};

	// Update modal open handler
	const handleModalOpen = (user = null) => {
		if (user) {
			reset({
				username: user.username,
				name: user.name,
				role: user.role,
				pharmacyId: user.pharmacyId?.pharmacyId || "", // Extract pharmacyId string
			});
		} else {
			handleFormReset();
		}
		setSelectedUser(user);
		onOpen();
	};

	// Update form submission
	const onSubmit = async (data) => {
		console.log("onSubmit called", data);
		setIsSubmitting(true);
		try {
			if (selectedUser) {
				await axios.put(`/pharmacy-api/users/${selectedUser._id}`, data, {
					headers: { Authorization: `Bearer ${Cookies.get("token")}` },
				});
			} else {
				await axios.post("/pharmacy-api/users", data, {
					headers: { Authorization: `Bearer ${Cookies.get("token")}` },
				});
			}
			fetchUsers();
			onClose();
			handleFormReset();
			toast({
				title: `User ${selectedUser ? "updated" : "created"} successfully`,
				status: "success",
				duration: 3000,
			});
		} catch (error) {
			toast({
				title: `Error ${selectedUser ? "updating" : "creating"} user`,
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
			await axios.delete(`/pharmacy-api/users/${userToDelete._id}`, {
				headers: { Authorization: `Bearer ${Cookies.get("token")}` },
			});
			fetchUsers();
			onAlertClose();
			toast({
				title: "User deleted successfully",
				status: "success",
				duration: 3000,
			});
		} catch (error) {
			toast({
				title: "Error deleting user",
				description: error.response?.data?.message || "Something went wrong",
				status: "error",
				duration: 3000,
			});
		}
	};

	return (
		<Container maxW="container.xl" py={8}>
			<Box className="flex justify-between items-center mb-8">
				<Heading color="var(--text)">User Management</Heading>
				<Button
					leftIcon={<FiPlus />}
					onClick={() => handleModalOpen()}
					backgroundColor="var(--primary)"
					color="white"
					_hover={{ backgroundColor: "var(--button_hover)" }}>
					Add User
				</Button>
			</Box>

			<Grid templateColumns="repeat(auto-fill, minmax(45%, 1fr))" gap={6}>
				{users.map((user) => (
					<Box
						key={user._id}
						p={6}
						bg="white"
						borderRadius="xl"
						boxShadow="lg"
						position="relative"
						className="transition-all duration-200 hover:shadow-xl hover:transform hover:-translate-y-1">
						{/* Role Badge */}
						<Box
							position="absolute"
							top={4}
							right={4}
							px={3}
							py={1}
							borderRadius="full"
							bg={user.role === "admin" ? "var(--primary)" : "var(--secondary)"}
							color="white"
							fontSize="sm"
							fontWeight="medium">
							{user.role}
						</Box>

						{/* User Info */}
						<Box mb={6}>
							<Text fontSize="2xl" fontWeight="bold" color="var(--text)" mb={1}>
								{user.name}
							</Text>
							<Text color="gray.500" fontSize="sm" mb={4}>
								@{user.username}
							</Text>

							<Box p={4} bg="gray.50" borderRadius="lg" border="1px" borderColor="gray.100">
								<Text color="gray.600" fontSize="sm" mb={2}>
									<Box as="span" fontWeight="medium">
										Pharmacy:
									</Box>{" "}
									{Array.isArray(pharmacies)
										? pharmacies.find((p) => p.pharmacyId === user.pharmacyId?.pharmacyId)?.name
										: "Not assigned"}
								</Text>

								<Text color="gray.600" fontSize="sm">
									<Box as="span" fontWeight="medium">
										Last Updated:
									</Box>{" "}
									{new Date(user.updatedAt).toLocaleDateString()}
								</Text>
							</Box>
						</Box>

						{/* Actions */}
						<Box className="flex justify-end gap-3" borderTop="1px" borderColor="gray.100" pt={4}>
							<Button
								size="sm"
								leftIcon={<FiEdit2 />}
								onClick={() => {
									setSelectedUser(user);
									reset();
									onOpen();
								}}
								bg="var(--accent)"
								color="white"
								_hover={{ bg: "var(--button_hover)" }}
								className="transition-all duration-200">
								Edit
							</Button>
							<Button
								size="sm"
								leftIcon={<FiTrash2 />}
								onClick={() => {
									setUserToDelete(user);
									onAlertOpen();
								}}
								variant="outline"
								colorScheme="red"
								className="transition-colors duration-200">
								Delete
							</Button>
						</Box>
					</Box>
				))}
			</Grid>

			{/* Create/Edit Modal */}
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>{selectedUser ? "Edit User" : "Create User"}</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<form onSubmit={handleSubmit(onSubmit)}>
							<FormControl mb={4} isInvalid={!!errors.username}>
								<FormLabel>Username</FormLabel>
								<Input {...register("username")} />
								<FormErrorMessage>{errors.username?.message}</FormErrorMessage>
							</FormControl>

							<FormControl mb={4} isInvalid={!!errors.password}>
								<FormLabel>Password</FormLabel>
								<Input type="password" {...register("password")} />
								<FormErrorMessage>{errors.password?.message}</FormErrorMessage>
								{selectedUser && (
									<Text fontSize="sm" color="gray.500" mt={1}>
										Leave empty to keep existing password
									</Text>
								)}
							</FormControl>

							<FormControl mb={4} isInvalid={!!errors.name}>
								<FormLabel>Name</FormLabel>
								<Input {...register("name")} />
								<FormErrorMessage>{errors.name?.message}</FormErrorMessage>
							</FormControl>

							<FormControl mb={4} isInvalid={!!errors.role}>
								<FormLabel>Role</FormLabel>
								<Select {...register("role")}>
									<option value="">Select Role</option>
									<option value="user">User</option>
									<option value="admin">Admin</option>
								</Select>
								<FormErrorMessage>{errors.role?.message}</FormErrorMessage>
							</FormControl>

							<FormControl mb={4} isInvalid={!!errors.pharmacyId}>
								<FormLabel>Pharmacy</FormLabel>
								<Select {...register("pharmacyId")}>
									<option value="">Select Pharmacy</option>
									{pharmacies.map((pharmacy) => (
										<option key={pharmacy.pharmacyId} value={pharmacy.pharmacyId}>
											{pharmacy.name}
										</option>
									))}
								</Select>
								<FormErrorMessage>{errors.pharmacyId?.message}</FormErrorMessage>
							</FormControl>

							<Button
								type="submit"
								colorScheme="blue"
								mr={3}
								w="full"
								isLoading={isSubmitting}
								onClick={handleSubmit(onSubmit)}>
								{selectedUser ? "Update" : "Create"}
							</Button>
						</form>
					</ModalBody>
				</ModalContent>
			</Modal>

			{/* Delete Alert */}
			<AlertDialog isOpen={isAlertOpen} onClose={onAlertClose}>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader>Delete User</AlertDialogHeader>
						<AlertDialogBody>
							Are you sure you want to delete {userToDelete?.name}? This action cannot be undone.
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

export default UserManagement;
