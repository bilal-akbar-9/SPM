import { createBrowserRouter } from "react-router-dom";

// import Layout from "./components/Layout";
// import Home from "./pages/Home/Home";
import Inventory from "./pages/Inventory/Inventory";
import Prescription from "./pages/Prescription/Prescription";
import Billing from "./pages/Billing/Billings";
import Analytics from "./pages/Analytics/Analytics";

// import AdminLayout from "./components/AdminLayout/AdminLayout";
// import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
// import UserManagement from "./pages/UserManagement/UserManagement";
// import SettingsPage from "./pages/SettingsPage/SettingsPage";

const routes = createBrowserRouter([
	{
		path: "/",
		// element: <Layout />,
		children: [
			{
				path: "",
				// element: <Home />,
			},
			{
				path: "inventory",
				element: <Inventory />,
			},
			{
				path: "prescriptions",
				element: <Prescription />,
			},
			{
				path: "billing",
				element: <Billing />,
			},
			{
				path: "analytics",
				element: <Analytics />,
			},
		],
	},
	{
		path: "/admin",
		// element: <AdminLayout />,
		children: [
			{
				path: "",
				// element: <AdminDashboard />,
			},
			{
				path: "settings",
				// element: <SettingsPage />,
			},
		],
	},
]);

export default routes;
