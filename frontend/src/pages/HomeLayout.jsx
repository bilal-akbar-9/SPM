// HomeLayout.jsx
import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const HomeLayout = () => {
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
