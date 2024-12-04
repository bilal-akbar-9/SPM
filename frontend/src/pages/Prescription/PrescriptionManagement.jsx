// PrescriptionManagement.jsx
import { useState } from 'react';
import { Box, Input, Button, VStack, Text } from '@chakra-ui/react';
import PrescriptionList from './PrescriptionList';
import MedicineDetails from './MedicineDetails';
import usePrescriptionStore from '../../hooks/usePrescriptionStore';

const PrescriptionManagement = () => {
    const [userId, setUserId] = useState('');
    const { selectedPrescription, setSelectedPrescription, setPrescriptionUser, prescriptionUser } = usePrescriptionStore();
    
    const handleSearch = () => {
        setPrescriptionUser(userId); // Update global state only on search
        console.log("The prescriptionUser is, ", prescriptionUser);
    };

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
                        onChange={(e) => setUserId(e.target.value)} // Fix: Use local state
                    />

                    <Button onClick={handleSearch}>Search</Button>

                    {userId && (
                        <PrescriptionList
                            userId={prescriptionUser}
                            onSelectPrescription={setSelectedPrescription}
                        />
                    )}
                </VStack>
            )}
        </Box>
    );
};

export default PrescriptionManagement;