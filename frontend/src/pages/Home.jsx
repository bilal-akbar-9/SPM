import { Box, Container, Heading, Text, VStack, SimpleGrid, Stat, StatLabel, StatNumber, Skeleton} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { motion } from "framer-motion";
import { FaHospitalUser, FaPills, FaClinicMedical } from "react-icons/fa";
import { useState } from "react";
import useUserStore from "../hooks/useUserStore";


const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const mockNews = [
  {
    title: "Advances in Pharmacy Automation",
    description: "New robotic systems are revolutionizing how pharmacies handle prescription fulfillment, reducing errors and improving efficiency in medication dispensing.",
    urlToImage: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80",
    url: "#"
  },
  {
    title: "The Future of Personalized Medicine",
    description: "Pharmacogenomics is changing how we approach medication therapy, allowing pharmacists to tailor drug treatments based on patients' genetic profiles.",
    urlToImage: "https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&q=80",
    url: "#"
  },
  {
    title: "Sustainable Practices in Modern Pharmacies",
    description: "Healthcare facilities are adopting eco-friendly initiatives, from medication packaging to waste management, setting new standards for environmental responsibility.",
    urlToImage: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80",
    url: "#"
  },
  {
    title: "The Impact of Pharmacy Professionals on Patient Lives",
    description: "Exploring the profound difference pharmacists make in healthcare outcomes, featuring real stories of how medication expertise and patient counseling save lives daily.",
    urlToImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80",
    url: "#"
  },
  {
    title: "Professional Growth in Modern Pharmacy Practice",
    description: "Discover opportunities for career advancement and specialization in pharmacy, from clinical pharmacy to pharmaceutical research, and how continuous learning shapes healthcare excellence.",
    urlToImage: "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80",
    url: "#"
  },
  {
    title: "Building a Positive Pharmacy Work Culture",
    description: "Learn how pharmacies are creating supportive environments that prioritize work-life balance, team collaboration, and professional satisfaction, leading to better patient care outcomes.",
    urlToImage: "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?auto=format&fit=crop&q=80",
    url: "#"
  }
];


const Home = () => {
  const [news] = useState(mockNews);
  const [isLoading] = useState(false); // Set to false since we're using mock data
  const animation = `${fadeIn} 1s ease-out forwards`;
  const quote = "Dedicated to serving our community with care and compassion.";
  const { user } = useUserStore();

  return (
    <Box 
      minH="90vh" 
      bg="var(--background)"
      className="relative overflow-hidden"
    >
      {/* Background Pattern */}
      <Box
        className="absolute inset-0 z-0"
        bg="radial-gradient(circle at 50% 50%, var(--secondary) 1px, transparent 1px)"
        style={{
          backgroundSize: "30px 30px",
          opacity: 0.1
        }}
      />

      <Container maxW="container.xl" className="relative z-10">
        <VStack 
          spacing={8} 
          textAlign="center" 
          py={20}
          animation={animation}
        >
          <Box 
            as={motion.div}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4"
          >
            <FaClinicMedical size={40} color="var(--primary)" />
            <Heading
              fontSize={{ base: "4xl", md: "6xl" }}
              bgGradient="linear(to-r, var(--primary), var(--accent))"
              bgClip="text"
              fontWeight="bold"
            >
              Pharmacy Management System
            </Heading>
          </Box>

          <Text
            fontSize={{ base: "lg", md: "xl" }}
            color="var(--text)"
            maxW="2xl"
            opacity={0.9}
            className="italic"
          >
            {quote}
          </Text>
          <Text
            fontSize={{ base: "lg", md: "xl" }}
            color="var(--text)"
            maxW="2xl"
            opacity={0.9}
            className="italic"
          >
            PharmacyId: {user?.pharmacyId.pharmacyId}
          </Text>

          <Box 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-16"
            as={motion.div}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {[
              {
                icon: FaHospitalUser,
                title: "Patient Care",
                description: "Providing exceptional service to every patient"
              },
              {
                icon: FaPills,
                title: "Inventory Management",
                description: "Efficient tracking and management of medical supplies"
              },
              {
                icon: FaClinicMedical,
                title: "Healthcare Excellence",
                description: "Maintaining the highest standards of pharmaceutical care"
              }
            ].map((item, index) => (
              <Box
                key={index}
                p={8}
                bg="white"
                borderRadius="xl"
                boxShadow="lg"
                textAlign="center"
                transition="all 0.3s"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "xl",
                  borderColor: "var(--primary)"
                }}
                className="border-2 border-transparent"
              >
                <Box 
                  className="mx-auto mb-4 p-3 rounded-full"
                  bg="var(--background)"
                  width="fit-content"
                >
                  <item.icon size={30} color="var(--accent)" />
                </Box>
                <Heading 
                  size="md" 
                  mb={3}
                  color="var(--text)"
                >
                  {item.title}
                </Heading>
                <Text color="gray.600">
                  {item.description}
                </Text>
              </Box>
            ))}
          </Box>
        </VStack>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={10} mt={16}>
          {[
            { label: "Prescriptions Filled", value: "10,000+" },
            { label: "Active Patients", value: "5,000+" },
            { label: "Medications Stocked", value: "2,000+" },
            { label: "Years of Service", value: "15+" }
          ].map((stat, index) => (
            <Box
              key={index}
              as={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              p={6}
              bg="white"
              borderRadius="lg"
              boxShadow="md"
              textAlign="center"
            >
              <Stat>
                <StatLabel color="gray.600">{stat.label}</StatLabel>
                <StatNumber 
                  fontSize="3xl" 
                  color="var(--accent)"
                  fontWeight="bold"
                >
                  {stat.value}
                </StatNumber>
              </Stat>
            </Box>
          ))}
        </SimpleGrid>
                {/* Latest Healthcare News */}
                <Box mt={20}>
          <Heading 
            size="xl" 
            textAlign="center" 
            mb={10}
            color="var(--text)"
          >
            Healthcare Articles
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <Box key={i} p={6} bg="white" borderRadius="lg" boxShadow="md">
                  <Skeleton height="200px" />
                  <Skeleton height="20px" mt={4} />
                  <Skeleton height="20px" mt={2} />
                </Box>
              ))
            ) : (
              news.map((article, index) => (
                <Box
                  key={index}
                  as={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  p={6}
                  bg="white"
                  borderRadius="lg"
                  boxShadow="md"
                  _hover={{
                    transform: "translateY(-5px)",
                    boxShadow: "xl",
                  }}
                  transition={{ duration: 0.3, delay: 0.2 * index, ease: "easeOut" }}
                >
                  {article.urlToImage && (
                    <Box
                      bgImage={`url(${article.urlToImage})`}
                      bgSize="cover"
                      bgPosition="center"
                      h="200px"
                      mb={4}
                      borderRadius="md"
                    />
                  )}
                  <Heading size="md" mb={2} color="var(--text)">
                    {article.title}
                  </Heading>
                  <Text color="gray.600" noOfLines={3}>
                    {article.description}
                  </Text>
                  <Text 
                    mt={2} 
                    color="var(--primary)" 
                    fontWeight="bold"
                    as="a"
                    href={article.url}
                    target="_blank"
                  >
                    Read more →
                  </Text>
                </Box>
              ))
            )}
          </SimpleGrid>
        </Box>

        {/* Footer Quote */}
        <Box 
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          textAlign="center"
          mt={20}
          mb={10}
          p={8}
          bg="white"
          borderRadius="xl"
          boxShadow="lg"
        >
          <Text
            fontSize={{ base: "xl", md: "2xl" }}
            fontStyle="italic"
            color="var(--text)"
          >
            "The art of medicine consists in amusing the patient while nature cures the disease."
          </Text>
          <Text color="var(--accent)" mt={2}>
            - Voltaire
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;