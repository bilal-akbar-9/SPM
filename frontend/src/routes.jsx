import { createBrowserRouter } from "react-router-dom";

//Probably Temp Routes that will be replaced after full project integration
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

// import Layout from "./components/Layout";
// import Home from "./pages/Home/Home";
import Inventory from "./pages/Inventory/Inventory";
import Billing from "./pages/Billing/Billings";
import Analytics from "./pages/Analytics/Analytics";
import PharmacySelection from "./pages/PharmacySelection";
import PharmacyDashboardHome from "./pages/PharmacyDashboardHome";

//Layouts
import HomeLayout from "./pages/HomeLayout";
import PrescriptionManagement from "./pages/Prescription/PrescriptionManagement";


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
                element: <Login />
            },
            {
                path: "register",
                element: <Register />
            },
            {
                path: "pharmacy-selection",
                element: <PharmacySelection />
            },
            {
                path: "dashboard",
                element: <HomeLayout />,
                children: [
                    {
                        path: "inventory",
                        element: <Inventory />
                    },
                    {
                        path: "prescriptions",
                        element: <PrescriptionManagement />
                    },
                    {
                        path: "billing",
                        element: <Billing />
                    },
                    {
                        path: "analytics",
                        element: <Analytics />
                    },
                    {
                        path: "home",
                        element: <PharmacyDashboardHome />
                    }
                ]
            }
        ]
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
