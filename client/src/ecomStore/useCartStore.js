import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useAuthStore } from "./authStore";

let storeName = () => useAuthStore.getState().user?.sub;

const cartStore = (set, get) => ({
    cart: [],

    actionCallStoreName: () => {
        const name = storeName();
        return name;
    },

    actionAddToCart: (item) => {
        const product = { ...item };
        delete product.Image;
        const cart = get().cart;

        product.qty = 1;

        // found return index notfound return -1
        const index = cart.findIndex(e => e.id === product.id);
        const unit = cart.find(e => e.id === product.id);

        if (index === -1) {
            // recheck stock
            if (product.stock < product.qty) return false;

            set({ cart: [product, ...cart] });
            return true;
        } else {
            // recheck stock
            if (product.stock < (unit.qty + 1)) return false;

            unit.qty += 1;

            // remove arr(index,count)
            cart.splice(index, 1);

            set({ cart: [unit, ...cart] });
            return true;
        }
    },
});

const usePersist = {
    name: 'cartStore-121167-' + storeName(),
    storage: createJSONStorage(() => localStorage),
};

export const useCartStore = create(persist(cartStore, usePersist));