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
  useToast,
  ModalCloseButton
} from "@chakra-ui/react";
import axios from "axios";
import useUserStore from "../../hooks/useUserStore";
import usePrescriptionStore from "../../hooks/usePrescriptionStore";
import Cookies from "js-cookie";
import { FiPrinter, FiDownload } from 'react-icons/fi';


const MedicineDetails = ({ prescriptionId, onBack }) => {
  const toast = useToast();
  const [medicineDetails, setMedicineDetails] = useState([]);
  const [quantityErrors, setQuantityErrors] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useUserStore();
  const { prescriptionUser, selectedPrescription } = usePrescriptionStore()
  const [billingLoading, setBillingLoading] = useState(false);
  
  // PDF Modal
  const [pdfData, setPdfData] = useState(null);
  const { 
    isOpen: isPdfOpen, 
    onOpen: onPdfOpen, 
    onClose: onPdfClose 
  } = useDisclosure();

  useEffect(() => {
    return () => {
      if (pdfData) {
        URL.revokeObjectURL(pdfData);
      }
    };
  }, [pdfData]);

  useEffect(() => {
    const fetchMedicineDetails = async () => {
      try {
        const response = await axios.get(
          `/pharmacy-api/prescriptions/${prescriptionId}/medicine-details`,
          {
            params: {
              pharmacyId: user.pharmacyId.pharmacyId
            }
          }
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
    const newQuantityErrors = { ...quantityErrors };
    const medicine = newMedicineDetails[index];
    const newQuantity = Number(value);
  
    // Update quantity regardless of availability
    medicine.currentQuantity = newQuantity;
  
    // Validate quantity against available stock
    if (medicine.availability && newQuantity > medicine.availableQuantity) {
      newQuantityErrors[index] = "Not enough stock";
    } else {
      delete newQuantityErrors[index];
    }
  
    setQuantityErrors(newQuantityErrors);
    setMedicineDetails(newMedicineDetails);
  };
  
  const calculateTotal = () => {
    return medicineDetails.reduce(
      (total, medicine) => total + (medicine.price * medicine.currentQuantity || 0),
      0
    );
  };

  const canProceedToBilling = () => {
    return !medicineDetails.some(medicine => 
      (medicine.availability && medicine.currentQuantity > medicine.availableQuantity) || 
      (!medicine.availability && medicine.currentQuantity !== 0)
    );
  };

  const proceedToBilling = async () => {
    setBillingLoading(true);
    try {
      const billingData = {
        prescriptionId: selectedPrescription,
        patientId: "672e31eb54819b9cb2e17942",
        medicines: medicineDetails
          .filter(medicine => medicine.currentQuantity > 0)
          .map(medicine => ({
            medicineId: medicine.medicationId,
            medicineName: medicine.name,
            medicineQuantity: medicine.currentQuantity,
            medicineUnitPrice: medicine.price
          }))
      };
  
      const response = await axios.post(
        import.meta.env.VITE_BILLING_API_URL,
        billingData,
        {
          headers: { 
            Authorization: `Bearer ${Cookies.get("token")}`,
          }
        }
      );
  
      // Update prescription status after successful billing
      if (response.data.success) {
        await axios.patch(
          `/pharmacy-api/prescriptions/${selectedPrescription}/status`,
          {
            status: "Fulfilled",
            billId: response.data.data._id // Add bill ID to prescription
          },
          {
            headers: { 
              Authorization: `Bearer ${Cookies.get("token")}` 
            }
          }
        );
  
        // Handle PDF display
        const base64Data = response.data.pdf;
        const binaryData = atob(base64Data);
        const byteArray = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
          byteArray[i] = binaryData.charCodeAt(i);
        }
        
        const pdfBlob = new Blob([byteArray], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setPdfData(pdfUrl);
        onClose(); // Close confirmation modal
        onPdfOpen(); // Open PDF modal
  
        toast({
          title: "Billing Successful",
          description: "Your bill has been generated",
          status: "success",
          duration: 5000,
        });
      }
    } catch (error) {
      toast({
        title: "Error generating bill",
        description: error.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 5000,
      });
    } finally {
      setBillingLoading(false);
    }
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
                    min={0}
                    max={medicine.availableQuantity || 0}
                    value={medicine.currentQuantity}
                    onChange={(value) => handleQuantityChange(index, value)}
                    size="sm"
                    isInvalid={!!quantityErrors[index]}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>

                  {quantityErrors[index] && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {quantityErrors[index]}
                    </Text>
                  )}
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.600">Available:</Text>
                  <Text fontWeight="semibold">{medicine.availableQuantity}</Text>
                </Box>
                <Box>
                  <Text
                    fontSize="sm"
                    color={medicine.availability 
                      ? quantityErrors[index] 
                        ? "orange.500" 
                        : "green.500" 
                      : "red.500"}
                    fontWeight="medium"
                  >
                    {medicine.availability 
                      ? quantityErrors[index]
                        ? "Not enough stock"
                        : "In Stock"
                      : "Out of Stock"}
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
          isDisabled={!canProceedToBilling()}
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
          <Button variant="ghost" mr={3} onClick={onClose} isDisabled={billingLoading}>
            Cancel
          </Button>
          <Button
            bg="var(--primary)"
            color="white"
            _hover={{ bg: "var(--button_hover)" }}
            onClick={proceedToBilling}
            isLoading={billingLoading}
            loadingText="Processing"
          >
            Proceed to Billing
          </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        {/* PDF Modal */}
      <Modal isOpen={isPdfOpen} onClose={onPdfClose} size="6xl">
        <ModalOverlay />
        <ModalContent maxW="900px" h="90vh">
          <ModalHeader>Bill PDF</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {pdfData && (
              <iframe
                src={pdfData}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              as="a"
              href={pdfData}
              download="bill.pdf"
              leftIcon={<FiDownload />}
              colorScheme="green"
              mr={3}
            >
              Download
            </Button>
            <Button variant="ghost" onClick={onPdfClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default MedicineDetails;