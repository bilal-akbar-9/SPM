import { Box, VStack, Text, Link, Icon, Flex} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FaCog, FaSignOutAlt } from "react-icons/fa";
import { useNavigate} from "react-router-dom";
import {
	FaHome,
	FaPrescriptionBottle,
	FaChartBar,
	FaBoxes,
	FaFileInvoiceDollar,
} from "react-icons/fa";

const Navbar = () => {
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.clear();
		navigate("/");
	};
	const menuItems = [
		{ icon: FaHome, text: "Dashboard", path: "/dashboard/home" },
		{ icon: FaBoxes, text: "Inventory", path: "/dashboard/inventory" },
		{ icon: FaPrescriptionBottle, text: "Prescriptions", path: "/dashboard/prescriptions" },
		{ icon: FaFileInvoiceDollar, text: "Billing", path: "/dashboard/billing" },
		{ icon: FaChartBar, text: "Analytics", path: "/dashboard/analytics" },
	];

	return (
		<Box
			minH="100vh"
			w="64"
			bg="white"
			borderRight="1px"
			borderColor="gray.200"
			position="fixed"
			left="0"
			top="0">
			<Flex
				h="14"
				alignItems="center"
				justifyContent="center"
				borderBottom="1px"
				borderColor="gray.200">
				<Text fontSize="xl" fontWeight="bold" color="var(--primary)">
					Pharmacy
				</Text>
			</Flex>

			<VStack spacing="0" align="stretch" overflow="auto" h="calc(100vh - 3.5rem)">
				<Box px="5" py="4">
					<Text fontSize="sm" color="gray.500">
						Menu
					</Text>
				</Box>

				{menuItems.map((item, index) => (
					<Link
						key={index}
						as={RouterLink}
						to={item.path}
						display="flex"
						alignItems="center"
						px="6"
						py="3"
						textDecor="none"
						color={location.pathname === item.path ? "var(--primary)" : "var(--text)"}
						bg={location.pathname === item.path ? "var(--background)" : "transparent"}
						borderLeft="4px solid"
						borderColor={location.pathname === item.path ? "var(--accent)" : "transparent"}
						_hover={{
							bg: "var(--background)",
							color: "var(--primary)",
							borderLeft: "4px solid",
							borderColor: "var(--accent)",
						}}
						transition="all 0.2s">
						<Icon as={item.icon} boxSize="5" color="inherit" />
						<Text ml="3" fontSize="sm">
							{item.text}
						</Text>
					</Link>
				))}
				<Box mt="auto" borderTop="1px" borderColor="gray.200">
					<Link
						as={RouterLink}
						to="/home/settings"
						display="flex"
						alignItems="center"
						px="6"
						py="3"
						textDecor="none"
						color="var(--text)"
						_hover={{
							bg: "var(--background)",
							color: "var(--primary)",
							borderLeft: "4px solid",
							borderColor: "var(--accent)",
						}}
						transition="all 0.2s">
						<Icon as={FaCog} boxSize="5" />
						<Text ml="3" fontSize="sm">
							Settings
						</Text>
					</Link>

					<Link
						onClick={handleLogout}
						display="flex"
						alignItems="center"
						px="6"
						py="3"
						textDecor="none"
						color="var(--text)"
						cursor="pointer"
						_hover={{
							bg: "var(--background)",
							color: "var(--primary)",
							borderLeft: "4px solid",
							borderColor: "var(--accent)",
						}}
						transition="all 0.2s">
						<Icon as={FaSignOutAlt} boxSize="5" />
						<Text ml="3" fontSize="sm">
							Logout
						</Text>
					</Link>
				</Box>
			</VStack>
		</Box>
	);
};

export default Navbar;
