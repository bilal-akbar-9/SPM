import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  VStack,
  Flex,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";

const MedicineDetails = ({ prescriptionId, onBack }) => {
  const [medicineDetails, setMedicineDetails] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchMedicineDetails = async () => {
      try {
        const response = await axios.get(
          `/pharmacy-api/prescriptions/${prescriptionId}/medicine-details`
        );
        setMedicineDetails(response.data.medicines.map(med => ({
          ...med,
          currentQuantity: med.quantity
        })));
      } catch (error) {
        console.error("Error fetching medicine details", error);
      }
    };
    fetchMedicineDetails();
  }, [prescriptionId]);

  const handleQuantityChange = (index, value) => {
    const newMedicineDetails = [...medicineDetails];
    newMedicineDetails[index].currentQuantity = Number(value);
    setMedicineDetails(newMedicineDetails);
  };

  const calculateTotal = () => {
    return medicineDetails.reduce(
      (total, medicine) => total + (medicine.price * medicine.currentQuantity || 0),
      0
    );
  };

  const proceedToBilling = () => {
    onClose();
    // Add billing navigation logic here
  };

  return (
    <VStack spacing={4} align="stretch" bg="var(--background)" p={6} borderRadius="xl">
      <Flex justify="space-between" align="center">
        <Button 
          onClick={onBack}
          bg="var(--primary)"
          color="white"
          _hover={{ bg: "var(--button_hover)" }}
        >
          Back to Prescriptions
        </Button>
        <Text fontSize="xl" fontWeight="bold" color="var(--text)">
          Medicine Details
        </Text>
      </Flex>

      {medicineDetails.map((medicine, index) => (
        <Box
          key={index}
          p={4}
          borderWidth={1}
          borderRadius="lg"
          bg="white"
          boxShadow="sm"
          _hover={{ boxShadow: "md" }}
          transition="all 0.2s"
        >
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="lg" fontWeight="bold" color="var(--text)">
                {medicine.name}
              </Text>
            </Box>
            <Box>
              <Flex align="center" gap={4}>
                <Box>
                  <Text fontSize="sm" color="gray.600">Quantity:</Text>
                  <NumberInput
                    min={1}
                    max={medicine.availability ? 999 : medicine.quantity}
                    value={medicine.currentQuantity}
                    onChange={(value) => handleQuantityChange(index, value)}
                    size="sm"
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </Box>
                <Box textAlign="right">
                  <Text fontSize="sm" color="gray.600">Price:</Text>
                  <Text fontWeight="semibold">
                    ${(medicine.price * medicine.currentQuantity).toFixed(2)}
                  </Text>
                </Box>
                <Box>
                  <Text
                    fontSize="sm"
                    color={medicine.availability ? "green.500" : "red.500"}
                    fontWeight="medium"
                  >
                    {medicine.availability ? "In Stock" : "Out of Stock"}
                  </Text>
                </Box>
              </Flex>
            </Box>
          </Flex>
        </Box>
      ))}

      <Box 
        width="100%" 
        mt={4}
        p={4}
        bg="white"
        borderRadius="lg"
        boxShadow="md"
      >
        <Flex justify="space-between" align="center">
          <Text fontSize="lg" fontWeight="bold" color="var(--text)">
            Total Price:
          </Text>
          <Text fontSize="xl" fontWeight="bold" color="var(--accent)">
            ${calculateTotal().toFixed(2)}
          </Text>
        </Flex>
        <Button
          mt={4}
          width="100%"
          bg="var(--primary)"
          color="white"
          _hover={{ bg: "var(--button_hover)" }}
          onClick={onOpen}
        >
          Continue to Billing
        </Button>
      </Box>

      {/* Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="var(--text)">Confirm Order</ModalHeader>
          <ModalBody>
            <Text mb={4}>Are you sure you want to proceed with the following order?</Text>
            <VStack align="stretch" spacing={2}>
              {medicineDetails.map((medicine, index) => (
                <Flex key={index} justify="space-between">
                  <Text>{medicine.name}</Text>
                  <Text>
                    {medicine.currentQuantity} × ${medicine.price.toFixed(2)} = $
                    {(medicine.currentQuantity * medicine.price.toFixed(2)).toFixed(2)}
                  </Text>
                </Flex>
              ))}
              <Box pt={4} borderTop="1px" borderColor="gray.200">
                <Flex justify="space-between">
                  <Text fontWeight="bold">Total:</Text>
                  <Text fontWeight="bold">${calculateTotal().toFixed(2)}</Text>
                </Flex>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              bg="var(--primary)"
              color="white"
              _hover={{ bg: "var(--button_hover)" }}
              onClick={proceedToBilling}
            >
              Proceed to Billing
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default MedicineDetails;