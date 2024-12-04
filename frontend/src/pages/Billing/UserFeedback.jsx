// UserFeedback.jsx
import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  VStack,
  Text,
  Input,
  useToast,
  Textarea
} from "@chakra-ui/react";
import ReactStars from "react-rating-stars-component";
import { useForm } from "react-hook-form";
import axios from "axios";
import useUserStore from "../../hooks/useUserStore";
import usePrescriptionStore from "../../hooks/usePrescriptionStore"
import { useNavigate } from "react-router-dom";

import Cookies from "js-cookie";

// UserFeedback.jsx - Update component
const UserFeedback = ({ onSubmitSuccess }) => {
  const { user } = useUserStore();
  const { prescriptionUser, selectedPrescription } = usePrescriptionStore();
  const [rating, setRating] = useState(0);
  const [manualUserId, setManualUserId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  console.log(prescriptionUser, selectedPrescription);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    if (rating === 0) {
      toast({
        title: "Error",
        description: "Please provide a rating",
        status: "error",
        duration: 3000,
      });
      return;
    }

    const feedbackUserId = prescriptionUser || manualUserId;
    if (!feedbackUserId) {
      toast({
        title: "Error",
        description: "Please provide a User ID",
        status: "error",
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`/pharmacy-api/pharmacies/${user.pharmacyId.pharmacyId}/feedback`, {
        rating,
        review: data.review,
        pharmacist: user.userId,
        userId: feedbackUserId,
        prescriptionId: selectedPrescription
      }, {
        headers: { 
          Authorization: `Bearer ${Cookies.get("token")}` 
        }
      });

      toast({
        title: "Success",
        description: "Thank you for your feedback!",
        status: "success",
        duration: 3000,
      });

      
      // Navigate after successful submission with delay
      setTimeout(() => {
        navigate("/dashboard/prescriptions");
      }, 3000);

      reset();
      setRating(0);
      setManualUserId('');
      if (onSubmitSuccess) onSubmitSuccess();

    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box 
      bg="white" 
      p={6} 
      borderRadius="xl" 
      boxShadow="lg"
      className="transition-all duration-200 hover:shadow-xl"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4} align="stretch">
          <Text 
            fontSize="xl" 
            fontWeight="bold" 
            color="var(--text)"
            textAlign="center"
          >
            Rate Your Experience
          </Text>

          <Box p={4} bg="gray.50" borderRadius="lg">
            <Text color="var(--text)" mb={2}>
              <Text as="span" fontWeight="bold">Pharmacist: </Text>
              {user.name}
            </Text>
            
            {prescriptionUser ? (
              <Text color="var(--text)">
                <Text as="span" fontWeight="bold">User ID: </Text>
                {prescriptionUser}
              </Text>
            ) : (
              <FormControl isRequired>
                <FormLabel color="var(--text)">User ID</FormLabel>
                <Input
                  placeholder="Enter your User ID"
                  value={manualUserId}
                  onChange={(e) => setManualUserId(e.target.value)}
                />
              </FormControl>
            )}
          </Box>

          <Box textAlign="center">
            <ReactStars
              count={5}
              onChange={setRating}
              size={40}
              activeColor="#0070f3"
              color="#e4e5e9"
              value={rating}
              isHalf={false}
            />
          </Box>

          <FormControl isInvalid={errors.review}>
            <FormLabel color="var(--text)">Your Review</FormLabel>
            <Textarea
              {...register("review", { 
                required: "Review is required",
                minLength: { 
                  value: 10, 
                  message: "Review should be at least 10 characters" 
                }
              })}
              placeholder="Tell us about your experience..."
              resize="vertical"
              minH="120px"
            />
            <FormErrorMessage>
              {errors.review && errors.review.message}
            </FormErrorMessage>
          </FormControl>

          <Button
            type="submit"
            isLoading={isSubmitting}
            backgroundColor="var(--primary)"
            color="white"
            _hover={{ backgroundColor: "var(--button_hover)" }}
            size="lg"
            width="full"
          >
            Submit Feedback
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default UserFeedback;