import React from "react";
import ReactDOM from "react-dom/client";
import routes from "./routes.jsx";
import axios from "axios";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ChakraProvider } from "@chakra-ui/react";
import Cookies from "js-cookie";
import "./index.css";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 3,
			cacheTime: 1000 * 60 * 60 * 24, // 1 day
		},
	},
});

axios.defaults.baseURL = process.env.VITE_API_URL;
axios.defaults.headers.common["Authorization"] = `${Cookies.get("token")}`;

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<ReactQueryDevtools buttonPosition="bottom-left" />
			<ChakraProvider>
				<RouterProvider router={routes} />
			</ChakraProvider>
		</QueryClientProvider>
	</React.StrictMode>
);
