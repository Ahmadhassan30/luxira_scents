'use client';

import { useCartStore } from '../store/cart.store';

export function useCart() {
    const items = useCartStore((s) => s.items);
    const addItem = useCartStore((s) => s.addItem);
    const removeItem = useCartStore((s) => s.removeItem);
    const updateQuantity = useCartStore((s) => s.updateQuantity);
    const clearCart = useCartStore((s) => s.clearCart);
    const totalItems = useCartStore((s) => s.totalItems());
    const totalPrice = useCartStore((s) => s.totalPrice());
    const isOpen = useCartStore((s) => s.isOpen);
    const openCart = useCartStore((s) => s.openCart);
    const closeCart = useCartStore((s) => s.closeCart);

    return {
        items,
        totalItems,
        totalPrice,
        isOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
    };
}
