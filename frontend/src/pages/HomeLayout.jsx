// HomeLayout.jsx
import { Box } from "@chakra-ui/react";
import { Outlet,useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import Cookies from "js-cookie";
import useUserStore from "../hooks/useUserStore";
import axios from "axios";

const HomeLayout = () => {
	const { user, setUser } = useUserStore();
	const navigate = useNavigate();
	const fetchUser = async () => {
		try {
			const response = await axios.get("/pharmacy-api/users/mydata",
				{
					headers: {
						Authorization: `Bearer ${Cookies.get("token")}`,
					},
				}
			);
			setUser(response.data.user);
		} catch (error) {
			console.log(error.response.data.Message);
		}
	}
	useEffect(() => {
		if (!Cookies.get("token")) {
			navigate("/");
		} else if (Object.keys(user).length === 0 && Cookies.get("token")) {
			fetchUser();
		}
	}, []);
	return (
		<Box display="flex">
			<Navbar />
			<Box
				ml="64" // matches navbar width
				p="6" // adds padding around content
				w="full" // takes full remaining width
				minH="100vh" // full viewport height
				bg="var(--background)" // use theme background
			>
				<Outlet />
			</Box>
		</Box>
	);
};

export default HomeLayout;
