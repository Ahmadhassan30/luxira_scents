import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@perfume/shared';

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    addItem: (item: CartItem) => void;
    removeItem: (variantId: string) => void;
    updateQuantity: (variantId: string, quantity: number) => void;
    clearCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    totalItems: () => number;
    totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            addItem: (newItem) =>
                set((state) => {
                    const existing = state.items.find((i) => i.variantId === newItem.variantId);
                    if (existing) {
                        return {
                            items: state.items.map((i) =>
                                i.variantId === newItem.variantId
                                    ? { ...i, quantity: i.quantity + newItem.quantity }
                                    : i,
                            ),
                        };
                    }
                    return { items: [...state.items, newItem] };
                }),

            removeItem: (variantId) =>
                set((state) => ({ items: state.items.filter((i) => i.variantId !== variantId) })),

            updateQuantity: (variantId, quantity) => {
                if (quantity <= 0) { get().removeItem(variantId); return; }
                set((state) => ({
                    items: state.items.map((i) =>
                        i.variantId === variantId ? { ...i, quantity } : i,
                    ),
                }));
            },

            clearCart: () => set({ items: [] }),
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
            totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
            totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        }),
        {
            name: 'luxira-cart',
            partialize: (state) => ({ items: state.items }), // only persist cart items, not UI state
        },
    ),
);
