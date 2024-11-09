import React, { useEffect, useState } from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';
import axios from 'axios';

const MedicineDetails = ({ prescriptionId }) => {
    const [medicineDetails, setMedicineDetails] = useState([]);

    useEffect(() => {
        const fetchMedicineDetails = async () => {
            const response = await axios.get(`/api/prescriptions/${prescriptionId}/medicine-details`);
            setMedicineDetails(response.data.medicines);
        };
        fetchMedicineDetails();
    }, [prescriptionId]);

    return (
        <VStack spacing={4} align="stretch">
            <Text fontSize="lg" fontWeight="bold">Medicine Details</Text>
            {medicineDetails.map((medicine, index) => (
                <Box key={index} p={4} borderWidth={1} borderRadius="lg">
                    <Text fontWeight="bold">{medicine.name}</Text>
                    <Text>Description: {medicine.description}</Text>
                    <Text>Price: ${medicine.price}</Text>
                    <Text>Availability: {medicine.availability ? 'In Stock' : 'Out of Stock'}</Text>
                    <Text>Dosage: {medicine.dosage}</Text>
                    <Text>Quantity: {medicine.quantity}</Text>
                    <Text>Instructions: {medicine.instructions}</Text>
                </Box>
            ))}
        </VStack>
    );
};

export default MedicineDetails;
