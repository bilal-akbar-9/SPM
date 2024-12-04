import React, { useEffect, useState } from "react";
import { Box, Text, VStack, Spinner, Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react";
import axios from "axios";

const Notifications = () => {
  const [lowStockInventories, setLowStockInventories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch low-stock inventories
  const fetchLowStockInventories = async () => {
    try {
      const response = await axios.get("/pharmacy-api/inventoryservices/notification");
      setLowStockInventories(response.data.inventories || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch low-stock inventories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStockInventories();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" color="blue.500" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={10}>
        <Alert status="error" variant="subtle">
          <AlertIcon />
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={5}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Low Stock Notifications
      </Text>

      {lowStockInventories.length === 0 ? (
        <Alert status="success" variant="subtle">
          <AlertIcon />
          <Text>No low-stock items found. All inventories are sufficiently stocked.</Text>
        </Alert>
      ) : (
        <VStack spacing={4} align="stretch">
          {lowStockInventories.map((inventory) => (
            <Box key={inventory._id} p={4} borderWidth="1px" borderRadius="lg" boxShadow="md">
              <Text fontWeight="bold" fontSize="lg" mb={2}>
                Pharmacy ID: {inventory.pharmacyId}
              </Text>
              <VStack spacing={2} align="stretch">
                {inventory.medications
                  .filter((medication) => medication.quantity < 20)
                  .map((medication) => (
                    <Box key={medication._id} p={3} bg="red.50" borderRadius="md">
                      <Text>
                        <b>Medicine:</b> {medication.medication?.name || "Unknown"}
                      </Text>
                      <Text>
                        <b>Quantity:</b> {medication.quantity}
                      </Text>
                      <Text>
                        <b>Expiration Date:</b> {new Date(medication.expirationDate).toLocaleDateString()}
                      </Text>
                    </Box>
                  ))}
              </VStack>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default Notifications;
