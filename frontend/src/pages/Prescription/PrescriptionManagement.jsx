import React, { useState } from 'react';
import { Box, Input, Button, VStack, Text } from '@chakra-ui/react';
import PrescriptionList from './PrescriptionList';
import MedicineDetails from './MedicineDetails';

const PrescriptionManagement = () => {
    const [userId, setUserId] = useState('');
    const [selectedPrescription, setSelectedPrescription] = useState(null);

    return (
        <Box>
            {selectedPrescription ? (
                <MedicineDetails
                    prescriptionId={selectedPrescription}
                    onBack={() => setSelectedPrescription(null)}
                />
            ) : (
                <VStack spacing={4} align="stretch">
                    <Text fontSize="lg" fontWeight="bold">Prescription Management</Text>

                    <Input
                        placeholder="Enter User ID"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                    />

                    <Button onClick={() => setSelectedPrescription(null)}>Search</Button>

                    {userId && (
                        <PrescriptionList
                            userId={userId}
                            onSelectPrescription={setSelectedPrescription}
                        />
                    )}
                </VStack>
            )}
        </Box>
    );
};

export default PrescriptionManagement;
