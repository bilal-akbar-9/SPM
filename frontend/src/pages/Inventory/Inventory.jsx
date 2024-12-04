import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  useToast,
  Button,
  Input,
} from "@chakra-ui/react";
import axios from "axios";

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // Fetch inventory from API
  const fetchInventory = async () => {
    try {
      const response = await axios.get("/pharmacy-api/inventoryservices/");
      setInventory(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      toast({
        title: "Error fetching inventory.",
        description: "Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  // Update quantity handler
  const handleUpdateQuantity = async (pharmacyId, medicationId) => {
    const newQuantity = prompt("Enter the new quantity:");
  
    // Check if the user canceled the prompt
    if (newQuantity === null || newQuantity.trim() === "") {
      return; // Do nothing if the prompt was canceled or input is empty
    }
  
    if (isNaN(newQuantity) || Number(newQuantity) < 0) {
      toast({
        title: "Invalid quantity.",
        description: "Please enter a valid number.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    try {
      await axios.put(`/pharmacy-api/inventoryservices/${pharmacyId}/update`, {
        medicationId,
        quantity: Number(newQuantity),
      });
      toast({
        title: "Quantity updated.",
        description: "The inventory has been successfully updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchInventory(); // Refresh inventory data
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast({
        title: "Error updating quantity.",
        description: "Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  

  useEffect(() => {
    fetchInventory();
  }, []);

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen bg-background">
        <Spinner size="xl" color="var(--chakra-primary)" />
      </Box>
    );
  }

  return (
    <Box className="min-h-screen bg-background p-6">
      <Heading
        as="h1"
        className="text-primary mb-6 text-center font-bold text-3xl"
      >
        Inventory Management
      </Heading>
      <Button
        className="bg-chakra-primary hover:bg-button_hover text-white py-2 px-4 rounded-md"
        onClick={() =>
          toast({ title: "Add inventory clicked", status: "info" })
        }
      >
        Add Inventory
      </Button>
      <Box className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8">
        {inventory.map((item) => (
          <Box
            key={item.pharmacyId}
            className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105"
          >
            <Box className="p-6">
              <Text className="text-xl font-bold text-chakra-primary mb-2">
                Pharmacy ID: {item.pharmacyId}
              </Text>
              <Box>
                <Heading
                  as="h3"
                  className="text-lg text-secondary font-medium mb-2"
                >
                  Medications:
                </Heading>
                <Box>
                  {item.medications.map((medication, index) => (
                    <Box
                      key={index}
                      className="border-b border-gray-200 pb-2 pt-2"
                    >
                      <Text className="text-text">
                        <strong>Name:</strong> {medication.medication.name}
                      </Text>
                      <Text className="text-text">
                        <strong>Manufacturer:</strong>{" "}
                        {medication.medication.manufacturer}
                      </Text>
                      <Text className="text-text">
                        <strong>Price:</strong> ${medication.medication.price}
                      </Text>
                      <Text className="text-text">
                        <strong>Quantity:</strong> {medication.quantity}
                      </Text>
                      <Text className="text-text">
                        <strong>Expiration Date:</strong>{" "}
                        {new Date(
                          medication.expirationDate
                        ).toLocaleDateString()}
                      </Text>
                      <Button
                        size="sm"
                        className="bg-button_hover hover:bg-chakra-primary text-white mt-2"
                        onClick={() =>
                          handleUpdateQuantity(
                            item.pharmacyId,
                            medication.medication._id
                          )
                        }
                      >
                        Update Quantity
                      </Button>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default InventoryPage;
