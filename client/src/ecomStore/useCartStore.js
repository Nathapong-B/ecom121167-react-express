import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useAuthStore } from "./authStore";
import { callProductsByList } from "../api/productApi";
import { confirmPayment, createOrder, listMyPurchase, removeOrder } from "../api/orderApi";

let userId = () => useAuthStore.getState().user?.sub;

const cartStore = (set, get) => ({
    cart: [],
    order: [],
    myPurchase: [],

    actionDataTest:()=>{
        console.log('data test')
        return 'data from data test';
    },

    actionTest:()=>{
        const data=get().actionDataTest()
        return data;

    },

    actionUpdateStock: async () => {
        const cart = get().cart;
        const arrListId = [...cart.map(e => (e.id))];
        const res = await callProductsByList(arrListId);
        const pChecker = res.data.result;

        // นำสต๊อกใน pChecker มาอัพเดท cart
        const cartUpdate = cart.reduce((acc, cur) => {
            for (let i of pChecker) {
                if (cur.id === i.id) {
                    cur.stock = i.stock;
                    acc.push(cur);
                    return acc;
                }
            }
        }, []);

        set({ cart: [...cartUpdate] });

    },

    actionAddToCart: (item) => {
        if (!userId()) return { error: { message: 'Please sign-in' } };

        const product = { ...item };
        // delete product.Image;
        // product.Image = item.Image.find(e => e.position === 0).url;
        const cart = get().cart;

        product.qty = 1;

        // found return index notfound return -1
        const index = cart.findIndex(e => e.id === product.id);
        const unit = cart.find(e => e.id === product.id);

        if (index === -1) {
            // recheck stock
            if (product.stock < product.qty) return { error: { message: 'Stock not enough' } };

            set({ cart: [product, ...cart] });
            return { success: { message: `${product.product_name.toUpperCase()} add to cart successful` } };
        } else {
            // recheck stock
            if (product.stock < (unit.qty + 1)) return { error: { message: 'Stock not enough' } };

            unit.qty += 1;

            // remove arr(index,count)
            cart.splice(index, 1);

            set({ cart: [unit, ...cart] });
            return { success: { message: `${product.product_name.toUpperCase()} add to cart successful` } };
        }
    },

    actionIncrease: (item) => {
        const product = { ...item };
        const cart = get().cart;

        // found return index notfound return -1
        const index = cart.findIndex(e => e.id === product.id);

        if (product.stock < (cart[index].qty + 1)) return { error: { message: 'Stock not enough' } };

        cart[index].qty += 1;

        set({ cart: [...cart] });
        return { success: { message: `${product.product_name.toUpperCase()} Increase successful` } };
    },

    actionDecrease: (item) => {
        const product = { ...item };
        const cart = get().cart;

        // found return index notfound return -1
        const index = cart.findIndex(e => e.id === product.id);

        if (cart[index].qty === 0) return { error: { message: 'Stock not enough' } };

        cart[index].qty -= 1;

        set({ cart: [...cart] });
        return { success: { message: `${product.product_name.toUpperCase()} Decrease successful` } };
    },

    actionRemoveFromCart: (items) => {
        const products = [...items];
        const cart = get().cart;

        const res = products.reduce((acc, cur) => (acc.filter(e => e.id !== cur.id)), cart);

        set({ cart: [...res] });

        return { success: { message: `Remove items successful` } };
    },

    actionAddToOrder: (items) => {
        set({ order: [...items] });
        return { success: { message: `Add order successful` } };
    },

    actionClearOrder: () => {
        set({ order: [] });
        return { success: { message: `Clear order successful` } };
    },


    // order
    actionCreateOrder: async (data, token) => {
        try {
            const res = await createOrder(data, token);

            if (res.status === 200) {
                return res;
            } else {
                return { error: { message: 'Somthing wrong' } };
            };
        } catch (err) {
            console.log(err);
            if (err?.code === "ERR_NETWORK") return { error: { message: err.message } };
            return { error: { message: err.response.data.message } };
        };
    },

    actionConfirmPayment: async (data, token) => {
        try {
            const res = await confirmPayment(data, token);

            if (res.status === 200) {
                return res;
            } else {
                return { error: { message: 'Somthing wrong' } };
            };
        } catch (err) {
            console.log(err);
            if (err?.code === "ERR_NETWORK") return { error: { message: err.message } };
            return { error: { message: err.response.data.message } };
        };
    },

    actionListMyPurchase: async (count, token) => {
        try {
            const res = await listMyPurchase(count, token);

            if (res.status === 200) {
                set({ myPurchase: res.data.result });
                return res;
            } else {
                return { error: { message: 'Somthing wrong' } };
            };
        } catch (err) {
            console.log(err);
            if (err?.code === "ERR_NETWORK") return { error: { message: err.message } };
            return { error: { message: err.response.data.message } };
        };
    },

    actionClearMyPurchase: () => {
        set({ myPurchase: [] });
    },

    actionRemoveOrder: async (id, token) => {
        try {
            const res = await removeOrder(id, token);

            if (res.status === 200) {
                const resList = await listMyPurchase(10, token);

                set({ myPurchase: resList.data.result });
                return res;
            } else {
                return { error: { message: 'Somthing wrong' } };
            };
        } catch (err) {
            console.log(err)
            return { error: { message: err.response.data.message } };
        }
    },
});

const usePersist = {
    name: 'cartStore-121167-' + userId(),
    storage: createJSONStorage(() => localStorage),
};

export const useCartStore = create(persist(cartStore, usePersist));