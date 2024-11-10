// HomeLayout.jsx
import { Box, Spinner } from "@chakra-ui/react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import useUserStore from "../hooks/useUserStore";
import axios from "axios";

const HomeLayout = () => {
  const { user, setUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const response = await axios.get("/pharmacy-api/users/mydata", {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      setUser(response.data.user);
    } catch (error) {
      console.log(error.response.data.Message);
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!Cookies.get("token")) {
      navigate("/");
    } else if (Object.keys(user).length === 0 && Cookies.get("token")) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
      <Spinner size="xl" color="var(--primary)" />
    </Box>;
  }

  return (
    <Box display="flex">
      <Navbar />
      <Box
        ml="64"
        p="6"
        w="full"
        minH="100vh"
        bg="var(--background)"
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default HomeLayout;
