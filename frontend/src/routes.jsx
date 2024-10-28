import { createBrowserRouter } from "react-router-dom";

// import Layout from "./components/Layout";
// import Home from "./pages/Home/Home";
// import Inventory from "./pages/Inventory/Inventory";
// import Prescriptions from "./pages/Prescriptions/Prescriptions";
// import Billing from "./pages/Billing/Billing";
// import Reports from "./pages/Reports/Reports";

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
				// element: <Inventory />,
			},
			{
				path: "prescriptions",
				// element: <Prescriptions />,
			},
			{
				path: "billing",
				// element: <Billing />,
			},
			{
				path: "reports",
				// element: <Reports />,
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
