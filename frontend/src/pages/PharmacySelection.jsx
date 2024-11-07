import { useState, useEffect } from 'react';
import { 
  Box, 
  Container,
  VStack,
  Heading,
  Select,
  Button,
  useToast,
  Text
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PharmacySelection = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const fetchPharmacies = async () => {
    try {
      const response = await axios.get('http://localhost:3000/pharmacy-api/pharmacies');
      setPharmacies(response.data);
    } catch (error) {
      toast({
        title: 'Error fetching pharmacies',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (!selectedPharmacy) {
      toast({
        title: 'Please select a pharmacy',
        status: 'warning',
        duration: 3000,
      });
      return;
    }
    localStorage.setItem('selectedPharmacy', selectedPharmacy);
    navigate('/dashboard');
  };

  return (
    <Box 
      minH="100vh" 
      bg="var(--background)" 
      color="var(--text)"
      className="flex items-center justify-center"
    >
      <Container maxW="md" py={12}>
        <VStack spacing={8} align="stretch">
          <Heading 
            textAlign="center"
            color="var(--chakra-primary)"
          >
            Select Your Pharmacy
          </Heading>
          
          <Box 
            bg="white" 
            p={8} 
            borderRadius="xl" 
            boxShadow="lg"
            className="backdrop-blur-sm bg-white/30"
          >
            <VStack spacing={6}>
              <Text color="var(--text)" fontSize="lg">
                Please select your pharmacy to continue
              </Text>

              <Select
                placeholder="Select pharmacy"
                value={selectedPharmacy}
                onChange={(e) => setSelectedPharmacy(e.target.value)}
                isDisabled={isLoading}
                borderColor="var(--secondary)"
                _hover={{ borderColor: 'var(--accent)' }}
                _focus={{ 
                  borderColor: 'var(--primary)',
                  boxShadow: '0 0 0 1px var(--primary)'
                }}
              >
                {pharmacies.map((pharmacy) => (
                  <option key={pharmacy.pharmacyId} value={pharmacy.pharmacyId}>
                    {pharmacy.name}
                  </option>
                ))}
              </Select>

              <Button
                w="full"
                onClick={handleContinue}
                isLoading={isLoading}
                bg="var(--primary)"
                color="white"
                _hover={{ bg: 'var(--button_hover)' }}
              >
                Continue
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default PharmacySelection;