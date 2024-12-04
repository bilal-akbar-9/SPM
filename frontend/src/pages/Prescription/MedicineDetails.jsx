import React, { useEffect, useState } from 'react';
import { Box, Text, VStack, Flex, Button } from '@chakra-ui/react';
import axios from 'axios';

const MedicineDetails = ({ prescriptionId, onBack }) => {
    const [medicineDetails, setMedicineDetails] = useState([]);

    useEffect(() => {
        const fetchMedicineDetails = async () => {
            try {
                const response = await axios.get(`/pharmacy-api/prescriptions/${prescriptionId}/medicine-details`);
                setMedicineDetails(response.data.medicines);
                console.log(response.data.medicines)
            } catch (error) {
                console.error("Error fetching medicine details", error);
            }
        };
        fetchMedicineDetails();
    }, [prescriptionId]);

    return (
        <VStack spacing={4} align="stretch">
            <Button onClick={onBack} colorScheme="blue">Back to Prescriptions</Button>
            <Text fontSize="lg" fontWeight="bold">Medicine Details</Text>
            {medicineDetails.map((medicine, index) => (
                <Flex 
                    key={index} 
                    p={4} 
                    borderWidth={1} 
                    borderRadius="lg" 
                    justifyContent="space-between" 
                    alignItems="center"
                >
                    <Box>
                        <Text fontWeight="bold">{medicine.name}</Text>
                    </Box>
                    <Box textAlign="right">
                        <Text>
                            ${medicine.price !== undefined && medicine.price !== null ? medicine.price.toFixed(2) : "N/A"}
                        </Text>
                        <Text color={medicine.availability ? "green.500" : "red.500"}>
                            {medicine.availability ? "In Stock" : "Out of Stock"}
                        </Text>
                    </Box>
                </Flex>
            ))}
        </VStack>
    );
};

export default MedicineDetails;
