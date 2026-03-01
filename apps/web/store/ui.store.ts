import { create } from 'zustand';

interface UIState {
    isCartOpen: boolean;
    isMobileNavOpen: boolean;
    activeModal: string | null;

    openCart: () => void;
    closeCart: () => void;
    openMobileNav: () => void;
    closeMobileNav: () => void;
    openModal: (id: string) => void;
    closeModal: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
    isCartOpen: false,
    isMobileNavOpen: false,
    activeModal: null,

    openCart: () => set({ isCartOpen: true }),
    closeCart: () => set({ isCartOpen: false }),
    openMobileNav: () => set({ isMobileNavOpen: true }),
    closeMobileNav: () => set({ isMobileNavOpen: false }),
    openModal: (id) => set({ activeModal: id }),
    closeModal: () => set({ activeModal: null }),
}));
