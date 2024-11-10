import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Text, Button, VStack, HStack, Spinner, useToast, IconButton } from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import Cookies from 'js-cookie';

const PharmacyManagement = () => {
    const [pharmacies, setPharmacies] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    // Fetch pharmacies on component mount
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

    // Delete pharmacy and refetch pharmacies
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

    if (loading) return <Spinner color="#319795" size="xl" />;

    return (
        <Box bg="#f7feff" minH="100vh" py="10" px="6">
            <Text fontSize="3xl" fontWeight="bold" color="#00191e" mb={6}>
                Pharmacy Management
            </Text>
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
        </Box>
    );
};

export default PharmacyManagement;
