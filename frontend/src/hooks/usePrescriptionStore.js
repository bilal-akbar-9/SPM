import { create } from "zustand";

const usePrescriptionStore = create((set) => ({
  prescriptionUser: null,
  selectedPrescription: null,
  selectedPrescriptionStatus: null,
  setPrescriptionUser: (user) => set({ prescriptionUser: user }),
  setSelectedPrescription: (prescription) => set({ selectedPrescription: prescription }),
  reset: () => set({ prescriptionUser: null, selectedPrescription: null }),
  setSelectedPrescriptionStatus: (status) => set({ selectedPrescriptionStatus: status }),
}));

export default usePrescriptionStore;