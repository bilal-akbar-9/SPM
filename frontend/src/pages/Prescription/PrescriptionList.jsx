import  { useState, useEffect } from 'react';
import { Text, VStack, Flex } from '@chakra-ui/react';
import axios from 'axios';

const PrescriptionList = ({ userId, onSelectPrescription, onSelectedPrescriptionStatus }) => {
    const [prescriptions, setPrescriptions] = useState([]);

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const response = await axios.get(`/pharmacy-api/prescriptions/patient/${userId}/valid-prescriptions`);
                setPrescriptions(response.data);
            } catch (error) {
                console.error("Error fetching prescriptions", error);
            }
        };
        fetchPrescriptions();
    }, [userId]);

    return (
        <VStack spacing={4} align="stretch">
            <Text fontSize="lg" fontWeight="bold">Select a Prescription</Text>
            {prescriptions.map((prescription, index) => (
                <Flex 
                    key={prescription._id} 
                    alignItems="center" 
                    justifyContent="space-between" 
                    p={4} 
                    borderWidth={1} 
                    borderRadius="lg" 
                    cursor="pointer" 
                    onClick={() => {
                        onSelectPrescription(prescription._id) 
                        onSelectedPrescriptionStatus(prescription.status)
                    }}
                >
                    <Text>Prescription {index + 1}</Text>
                    <Flex direction="column" align="flex-end">
                        <Text fontSize="sm" color="gray.600">{new Date(prescription.createdAt).toLocaleDateString()}</Text>
                        <Text 
                            fontSize="sm" 
                            color={
                                prescription.status === "Pending" ? "orange.500" :
                                prescription.status === "Fulfilled" ? "green.500" :
                                "red.500"
                            }
                        >
                            {prescription.status}
                        </Text>
                    </Flex>
                </Flex>
            ))}
        </VStack>
    );
};

export default PrescriptionList;
