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
  Container
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('/pharmacy-api/users/login', credentials);
      localStorage.setItem('user', JSON.stringify(response.data));
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 3000,
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Login failed',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
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
            Welcome Back
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
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="text"
                    value={credentials.username}
                    onChange={(e) => setCredentials({
                      ...credentials,
                      username: e.target.value
                    })}
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
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({
                      ...credentials,
                      password: e.target.value
                    })}
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
                  Login
                </Button>
              </VStack>
            </form>
          </Box>

          <Text textAlign="center">
            Don't have an account?{' '}
            <Button
              variant="link"
              color="var(--accent)"
              onClick={() => navigate('/register')}
              _hover={{ color: 'var(--primary)' }}
            >
              Register here
            </Button>
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default Login;