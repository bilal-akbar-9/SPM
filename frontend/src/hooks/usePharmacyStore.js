// usePharmacyStore.js
import { create } from "zustand";
import axios from "axios";
import Cookies from "js-cookie";

const usePharmacyStore = create((set) => ({
	pharmacies: [],
	selectedPharmacy: {},
	isLoading: false,
	error: null,

	fetchPharmacies: async () => {
		set({ isLoading: true });
		try {
			const response = await axios.get("/pharmacy-api/pharmacies", {
				headers: {
					Authorization: `Bearer ${Cookies.get("token")}`,
				},
			});
			console.log(response.data);
			set({ pharmacies: response.data || [] });
		} catch (error) {
			set({ error: error.response?.data?.message || "Failed to fetch pharmacies" });
		} finally {
			set({ isLoading: false });
		}
	},

	setPharmacies: (pharmacies) => set({ pharmacies }),
	setSelectedPharmacy: (selectedPharmacy) => set({ selectedPharmacy }),
}));

export default usePharmacyStore;
