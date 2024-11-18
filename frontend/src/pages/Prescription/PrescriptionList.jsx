import React, { useState, useEffect } from 'react';
import { Box, Button, Text, VStack } from '@chakra-ui/react';
import axios from 'axios';

const PrescriptionList = ({ userId, onSelectPrescription }) => {
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
            {prescriptions.map(prescription => (
                <Button key={prescription._id} onClick={() => onSelectPrescription(prescription._id)}>
                    Prescription {prescription._id}
                </Button>
            ))}
        </VStack>
    );
};

export default PrescriptionList;
