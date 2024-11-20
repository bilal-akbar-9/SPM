import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Text, Button, VStack, HStack, Spinner, useToast, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Input } from '@chakra-ui/react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import Cookies from 'js-cookie';

const PharmacyManagement = () => {
    const [pharmacies, setPharmacies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // New state for add modal
    const [selectedPharmacy, setSelectedPharmacy] = useState(null);
    const [updatedPharmacy, setUpdatedPharmacy] = useState({});
    const [newPharmacy, setNewPharmacy] = useState({ name: "", location: "", contactInfo: "" }); // State for new pharmacy
    const toast = useToast();

    useEffect(() => {
        const fetchPharmacies = async () => {
            try {
                const response = await axios.get("/pharmacy-api/pharmacies/", {
                    headers: { Authorization: `Bearer ${Cookies.get("token")}` },
                });
                setPharmacies(response.data);
            } catch (error) {
                toast({
                    title: "Error fetching Pharmacies",
                    description: error.response?.data?.message || "Something went wrong",
                    status: "error",
                    duration: 3000,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchPharmacies();
    }, [toast]);

    const deletePharmacy = async (id) => {
        try {
            await axios.delete(`/pharmacy-api/pharmacies/${id}`, {
                headers: { Authorization: `Bearer ${Cookies.get("token")}` },
            });

            // Refetch pharmacies after deleting
            const response = await axios.get("/pharmacy-api/pharmacies/", {
                headers: { Authorization: `Bearer ${Cookies.get("token")}` },
            });

            setPharmacies(response.data);

            toast({
                title: "Pharmacy deleted",
                description: "The pharmacy has been successfully deleted.",
                status: "success",
                duration: 3000,
            });
        } catch (error) {
            toast({
                title: "Error deleting pharmacy",
                description: error.response?.data?.message || "Something went wrong",
                status: "error",
                duration: 3000,
            });
        }
    };

    const openEditModal = (pharmacy) => {
        setSelectedPharmacy(pharmacy);
        setUpdatedPharmacy({
            name: pharmacy.name,
            location: pharmacy.location,
            contactInfo: pharmacy.contactInfo,
        });
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedPharmacy((prev) => ({ ...prev, [name]: value }));
    };

    const updatePharmacy = async () => {
        try {
            await axios.put(
                `/pharmacy-api/pharmacies/${selectedPharmacy.pharmacyId}`,
                updatedPharmacy,
                {
                    headers: { Authorization: `Bearer ${Cookies.get("token")}` },
                }
            );

            // Refetch pharmacies after updating
            const response = await axios.get("/pharmacy-api/pharmacies/", {
                headers: { Authorization: `Bearer ${Cookies.get("token")}` },
            });

            setPharmacies(response.data);
            setIsEditModalOpen(false);

            toast({
                title: "Pharmacy updated",
                description: "The pharmacy has been successfully updated.",
                status: "success",
                duration: 3000,
            });
        } catch (error) {
            toast({
                title: "Error updating pharmacy",
                description: error.response?.data?.message || "Something went wrong",
                status: "error",
                duration: 3000,
            });
        }
    };

    // Handle new pharmacy form changes
    const handleNewPharmacyChange = (e) => {
        const { name, value } = e.target;
        setNewPharmacy((prev) => ({ ...prev, [name]: value }));
    };

    const addNewPharmacy = async () => {
        try {
            const response = await axios.post(
                "/pharmacy-api/pharmacies/",
                newPharmacy,
                {
                    headers: { Authorization: `Bearer ${Cookies.get("token")}` },
                }
            );

            // Add the new pharmacy to the state
            setPharmacies((prev) => [...prev, response.data]);

            setIsAddModalOpen(false);
            setNewPharmacy({ name: "", location: "", contactInfo: "" }); // Reset form fields

            toast({
                title: "Pharmacy added",
                description: "The pharmacy has been successfully added.",
                status: "success",
                duration: 3000,
            });
        } catch (error) {
            toast({
                title: "Error adding pharmacy",
                description: error.response?.data?.message || "Something went wrong",
                status: "error",
                duration: 3000,
            });
        }
    };

    if (loading) return <Spinner color="#319795" size="xl" />;

    return (
        <Box bg="#f7feff" minH="100vh" py="10" px="6">
            <Text fontSize="3xl" fontWeight="bold" color="#00191e" mb={6}>
                Pharmacy Management
            </Text>
            
            {/* Add Pharmacy Button */}
            <Button
                colorScheme="teal"
                onClick={() => setIsAddModalOpen(true)}
                mb={6}
            >
                Add New Pharmacy
            </Button>

            <VStack spacing={5} align="stretch">
                {pharmacies.length > 0 ? (
                    pharmacies.map((pharmacy) => (
                        <Box
                            key={pharmacy._id}
                            boxShadow="md"
                            p={6}
                            rounded="lg"
                            bg="#f7feff"
                            border="1px solid #319795"
                        >
                            <HStack justify="space-between">
                                <Text fontSize="xl" fontWeight="medium" color="#319795">
                                    {pharmacy.name}
                                </Text>
                                <HStack>
                                    <IconButton
                                        icon={<FaEdit />}
                                        colorScheme="teal"
                                        onClick={() => openEditModal(pharmacy)}
                                        aria-label="Edit pharmacy"
                                    />
                                    <IconButton
                                        icon={<FaTrash />}
                                        colorScheme="red"
                                        onClick={() => deletePharmacy(pharmacy.pharmacyId)}
                                        aria-label="Delete pharmacy"
                                    />
                                </HStack>
                            </HStack>
                            <Text color="#00191e">Location: {pharmacy.location}</Text>
                            <Text color="#00191e">Contact: {pharmacy.contactInfo}</Text>
                        </Box>
                    ))
                ) : (
                    <Text color="#00191e">No pharmacies found</Text>
                )}
            </VStack>

            {/* Edit Pharmacy Modal */}
            <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit Pharmacy</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Input
                            placeholder="Pharmacy Name"
                            value={updatedPharmacy.name}
                            name="name"
                            onChange={handleInputChange}
                            mb={3}
                        />
                        <Input
                            placeholder="Location"
                            value={updatedPharmacy.location}
                            name="location"
                            onChange={handleInputChange}
                            mb={3}
                        />
                        <Input
                            placeholder="Contact Info"
                            value={updatedPharmacy.contactInfo}
                            name="contactInfo"
                            onChange={handleInputChange}
                        />
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={updatePharmacy}>
                            Save Changes
                        </Button>
                        <Button variant="ghost" onClick={closeEditModal}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Add New Pharmacy Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add New Pharmacy</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Input
                            placeholder="Pharmacy Name"
                            value={newPharmacy.name}
                            name="name"
                            onChange={handleNewPharmacyChange}
                            mb={3}
                        />
                        <Input
                            placeholder="Location"
                            value={newPharmacy.location}
                            name="location"
                            onChange={handleNewPharmacyChange}
                            mb={3}
                        />
                        <Input
                            placeholder="Contact Info"
                            value={newPharmacy.contactInfo}
                            name="contactInfo"
                            onChange={handleNewPharmacyChange}
                        />
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={addNewPharmacy}>
                            Add Pharmacy
                        </Button>
                        <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default PharmacyManagement;
