import { create } from "zustand";

const usePrescriptionStore = create((set) => ({
  prescriptionUser: null,
  selectedPrescription: null,
  setPrescriptionUser: (user) => set({ prescriptionUser: user }),
  setSelectedPrescription: (prescription) => set({ selectedPrescription: prescription }),
  reset: () => set({ prescriptionUser: null, selectedPrescription: null })
}));

export default usePrescriptionStore;