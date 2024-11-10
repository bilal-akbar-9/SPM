import { create } from "zustand";

const usePharmacyStore = create((set) => ({
	pharmacies: {},
	setPharmacies: (pharmacies) => set({ pharmacies }),
	selectedPharmacy: {},
	setSelectedPharmacy: (selectedPharmacy) => set({ selectedPharmacy }),
}));

export default usePharmacyStore;
