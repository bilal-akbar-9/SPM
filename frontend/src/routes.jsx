import { createBrowserRouter } from "react-router-dom";

//Probably Temp Routes that will be replaced after full project integration
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

// import Layout from "./components/Layout";
// import Home from "./pages/Home/Home";
import Inventory from "./pages/Inventory/Inventory";
import Notifications from "./pages/Inventory/Notification";
import Billing from "./pages/Billing/Billings";
import Analytics from "./pages/Analytics/Analytics";
import PharmacyDashboardHome from "./pages/PharmacyDashboardHome";

//Layouts
import HomeLayout from "./pages/HomeLayout";
import PrescriptionManagement from "./pages/Prescription/PrescriptionManagement";
import PharmacyManagement from "./pages/Admin/pharmacymangement";
// Protected Route
import ProtectedRoute from "./components/ProtectedRoute";
import UserManagement from "./pages/Admin/UserManagement/UserManagement";
import SupplierManagement from "./pages/Admin/SupplierManagement";



import ErrorPage from "./pages/ErrorPage";


// import AdminLayout from "./components/AdminLayout/AdminLayout";
// import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
// import UserManagement from "./pages/UserManagement/UserManagement";
// import SettingsPage from "./pages/SettingsPage/SettingsPage";

const routes = createBrowserRouter([
	{
		path: "/",
		children: [
			{
				path: "/",
				element: <Login />,
			},
			{
				path: "register",
				element: <Register />,
			},
			{
				path: "dashboard",
				element: <HomeLayout />,
				children: [
					{
						path: "inventory",
						element: <Inventory />,
					},
					{
						path: "prescriptions",
						element: <PrescriptionManagement />,
					},
					{
						path: "billing",
						element: <Billing />,
					},
					{
						path: "analytics",
						element: <Analytics />,
					},
					{
						path: "home",
						element: <PharmacyDashboardHome />,
					},
					{
						path: "users",
						element: (
							<ProtectedRoute requiredRole="admin">
								<UserManagement />
							</ProtectedRoute>
						),
					},
					{
						path: "pharmacies",
						element: (
							<ProtectedRoute requiredRole="admin">
								{ <PharmacyManagement />}
							</ProtectedRoute>
						),
					},
					{
						path: "suppliers",
						element: (
							<ProtectedRoute requiredRole="admin">
								<SupplierManagement />
							</ProtectedRoute>
						),
					},
					{
						path:"notifications",
						element:(
							<ProtectedRoute requiredRole="admin">
								<Notifications />
							</ProtectedRoute>
						)
					}
				],
			},
		],
	},
	{
		path: "*",
		element: <ErrorPage />,
	}
]);

export default routes;
