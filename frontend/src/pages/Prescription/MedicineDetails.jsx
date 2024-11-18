import React, { useEffect, useState } from 'react';
import { Box, Text, VStack, Button } from '@chakra-ui/react';
import axios from 'axios';

const MedicineDetails = ({ prescriptionId, onBack }) => {
    const [medicineDetails, setMedicineDetails] = useState([]);

    useEffect(() => {
        const fetchMedicineDetails = async () => {
            try {
                const response = await axios.get(`/pharmacy-api/prescriptions/${prescriptionId}/medicine-details`);
                setMedicineDetails(response.data.medicines);
            } catch (error) {
                console.error("Error fetching medicine details", error);
            }
        };
        fetchMedicineDetails();
    }, [prescriptionId]);

    const handleProceedToBilling = async () => {
        try {
            await axios.patch(`/pharmacy-api/prescriptions/${prescriptionId}/status`, { status: 'Inprogress' });
            window.location.href = '/pharmacy-api/billing'; // Redirect to billing page
        } catch (error) {
            console.error("Error updating prescription status", error);
        }
    };

    return (
        <VStack spacing={4} align="stretch">
            <Button onClick={onBack} colorScheme="blue">Back to Prescriptions</Button>
            <Text fontSize="lg" fontWeight="bold">Medicine Details</Text>
            {medicineDetails.map((medicine, index) => (
                <Box key={index} p={4} borderWidth={1} borderRadius="lg">
                    <Text fontWeight="bold">Medicine: {medicine.name}</Text>
                    <Text>Description: {medicine.description}</Text>
                    <Text>Price: ${medicine.price}</Text>
                    <Text>Availability: {medicine.availability ? 'In Stock' : 'Out of Stock'}</Text>
                    <Text>Dosage: {medicine.dosage}</Text>
                    <Text>Quantity: {medicine.quantity}</Text>
                    <Text>Instructions: {medicine.instructions}</Text>
                </Box>
            ))}
            <Button onClick={handleProceedToBilling} colorScheme="green">Proceed to Billing</Button>
        </VStack>
    );
};

export default MedicineDetails;
