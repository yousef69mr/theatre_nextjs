import { create } from "zustand";

type NavigationStore = {
  isOpen: boolean;
  isAdminOpen: boolean;
  onAdminOpen: () => void;
  onAdminClose: () => void;
  onOpen: () => void;
  onClose: () => void;
};

export const useNavigationStore = create<NavigationStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  isAdminOpen: false,
  onAdminOpen: () => set({ isAdminOpen: true }),
  onAdminClose: () => set({ isAdminOpen: false }),
}));
