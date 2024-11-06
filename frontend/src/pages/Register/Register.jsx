import { useState } from 'react';
import { 
  Box, 
  Button, 
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Container,
  Select
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    role: 'user',
    pharmacyId: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('/pharmacy-api/users', formData);
      toast({
        title: 'Registration successful',
        description: 'You can now login',
        status: 'success',
        duration: 3000,
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Registration failed',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
            Create Account
          </Heading>
          
          <Box 
            bg="white" 
            p={8} 
            borderRadius="xl" 
            boxShadow="lg"
            className="backdrop-blur-sm bg-white/30"
          >
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    borderColor="var(--secondary)"
                    _hover={{ borderColor: 'var(--accent)' }}
                    _focus={{ 
                      borderColor: 'var(--primary)',
                      boxShadow: '0 0 0 1px var(--primary)'
                    }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    borderColor="var(--secondary)"
                    _hover={{ borderColor: 'var(--accent)' }}
                    _focus={{ 
                      borderColor: 'var(--primary)',
                      boxShadow: '0 0 0 1px var(--primary)'
                    }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    borderColor="var(--secondary)"
                    _hover={{ borderColor: 'var(--accent)' }}
                    _focus={{ 
                      borderColor: 'var(--primary)',
                      boxShadow: '0 0 0 1px var(--primary)'
                    }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Role</FormLabel>
                  <Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    borderColor="var(--secondary)"
                    _hover={{ borderColor: 'var(--accent)' }}
                    _focus={{ 
                      borderColor: 'var(--primary)',
                      boxShadow: '0 0 0 1px var(--primary)'
                    }}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Pharmacy ID (Optional)</FormLabel>
                  <Input
                    name="pharmacyId"
                    value={formData.pharmacyId}
                    onChange={handleChange}
                    borderColor="var(--secondary)"
                    _hover={{ borderColor: 'var(--accent)' }}
                    _focus={{ 
                      borderColor: 'var(--primary)',
                      boxShadow: '0 0 0 1px var(--primary)'
                    }}
                  />
                </FormControl>

                <Button
                  w="full"
                  type="submit"
                  bg="var(--primary)"
                  color="white"
                  _hover={{ bg: 'var(--button_hover)' }}
                  isLoading={isLoading}
                >
                  Register
                </Button>
              </VStack>
            </form>
          </Box>

          <Text textAlign="center">
            Already have an account?{' '}
            <Button
              variant="link"
              color="var(--accent)"
              onClick={() => navigate('/login')}
              _hover={{ color: 'var(--primary)' }}
            >
              Login here
            </Button>
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default Register;