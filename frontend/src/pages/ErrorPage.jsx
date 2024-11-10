// ErrorPage.jsx
import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <Box 
      className="min-h-screen flex items-center justify-center bg-[var(--background)]"
    >
      <VStack spacing={8} className="text-center p-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Heading 
            size="4xl" 
            className="text-[var(--text)] font-bold"
          >
            404
          </Heading>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Heading 
            size="xl" 
            className="text-[var(--primary)] mb-4"
          >
            Oops! Page Not Found
          </Heading>

          <Text 
            className="text-[var(--text)] text-lg mb-8 max-w-md"
          >
            The page you are looking for might have been removed, had its name 
            changed, or is temporarily unavailable.
          </Text>

          <Button
            onClick={() => navigate("/")}
            backgroundColor="var(--primary)"
            color="white"
            size="lg"
            className="rounded-full transition-all duration-200 hover:shadow-lg z-10"
            _hover={{ backgroundColor: "var(--button_hover)" }}
          >
            Go Back
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-15 z-0"
        >
          <div className="w-64 h-64 relative">
            <div className="absolute inset-0 bg-[var(--secondary)] opacity-20 rounded-full animate-ping" />
            <div className="absolute inset-4 bg-[var(--accent)] opacity-30 rounded-full animate-pulse" />
            <div className="absolute inset-8 bg-[var(--primary)] opacity-40 rounded-full animate-bounce" />
          </div>
        </motion.div>
      </VStack>
    </Box>
  );
};

export default ErrorPage;