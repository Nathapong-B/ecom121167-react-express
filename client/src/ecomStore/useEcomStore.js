import { create } from "zustand";
import { addCategory, callListCategories, changeStatusCategory, removeCategory, updateCategory } from "../api/categoryApi";
import { createJSONStorage, persist } from "zustand/middleware";
import { addProduct, changeStatusProduct, listInactiveProducts, listProducts, removeProduct, updateProduct } from "../api/productApi";
import { listOrdersAdmin, removeOrder, updateOrder } from "../api/orderApi";

const ecomStore = (set, get) => ({
    categories: null,
    inactiveCategories: null,
    products: null,
    inactiveProducts: null,
    orders: null,

    actionCallListCategories: async (statusby, token) => {
        try {
            const res = await callListCategories(statusby, token);

            if (statusby === 'active') {
                set({ categories: res.data.result });
            } else {
                set({ inactiveCategories: res.data.result });
            }

            return res;
        } catch (err) {
            return { error: { message: err.response.data.message } };
        }
    },

    actionAddCategory: async ({ data, token }) => {
        try {
            const resAdd = await addCategory(data, token);

            if (resAdd.status === 200) {
                const res = await callListCategories('active', token);

                set({ categories: res.data.result });

                return resAdd;
            } else {
                return { error: { message: 'Somthing wrong' } };
            };
        } catch (err) {
            return { error: { message: err.response.data.message } };
        }
    },

    actionUpdateStatusCategory: async (item, token) => {
        try {
            const { id, status } = item;
            const data = status === 'active' ? { status: 'inactive' } : { status: 'active' };

            const resStatus = await changeStatusCategory(id, data, token);

            if (resStatus.status === 200) {
                const statusby = status;
                const res = await callListCategories(statusby, token);

                if (statusby === 'active') {
                    set({ categories: res.data.result });
                } else {
                    set({ inactiveCategories: res.data.result });
                }

                return resStatus;
            } else {
                return { error: { message: 'Somthing wrong' } };
            };
        } catch (err) {
            return { error: { message: err.response.data.message } };
        }
    },

    actionUpdateCategory: async (id, data, token) => {
        try {
            const resUpdate = await updateCategory(id, data, token);

            if (resUpdate.status === 200) {
                const res = await callListCategories('active', token);

                set({ categories: res.data.result });

                return resUpdate;
            } else {
                return { error: { message: 'Somthing wrong' } };
            };
        } catch (err) {
            return { error: { message: err.response.data.message } };
        }
    },

    actionRemoveCategory: async (id, token) => {
        try {
            const resRemove = await removeCategory(id, token);

            if (resRemove.status === 200) {
                const res = await callListCategories('inactive', token);

                set({ inactiveCategories: res.data.result });

                return resRemove;
            } else {
                return { error: { message: 'Somthing wrong' } };
            };
        } catch (err) {
            console.log(err)
            return { error: { message: err.response.data.message } };
        }
    },

    actionCallListProduct: async (count) => {
        try {
            const res = await listProducts(count);

            set({ products: res.data.result });

            return res;
        } catch (err) {
            // console.log(err)
            return { error: { message: err.response.data.message } };
        }
    },

    actionCallListInactiveProducts: async (count, token) => {
        try {
            const res = await listInactiveProducts(count, token);

            set({ inactiveProducts: res.data.result });

            return res;
        } catch (err) {
            // console.log(err)
            return { error: { message: err.response.data.message } };
        }
    },

    actionAddProduct: async (data, token) => {
        try {
            const res = await addProduct(data, token);

            return res;
        } catch (err) {
            console.log(err)
            return { error: { message: err.response.data.message } };
        }
    },

    actionUpdateProduct: async (id, data, token) => {
        try {
            const res = await updateProduct(id, data, token);

            return res;
        } catch (err) {
            console.log(err)
            return { error: { message: err.response.data.message } };
        }
    },

    actionUpdateStatusProduct: async (item, token) => {
        try {
            const { id, status } = item;
            const data = status === 'active' ? { status: 'inactive' } : { status: 'active' };

            const resStatus = await changeStatusProduct(id, data, token);

            if (resStatus.status === 200) {
                if (status === 'active') {
                    const res = await listProducts(6);

                    if (res.status === 200) set({ products: res.data.result });
                };

                if (status === 'inactive') {
                    const res = await listInactiveProducts(6, token);

                    if (res.status === 200) set({ inactiveProducts: res.data.result });
                };

                return resStatus;
            } else {
                return { error: { message: 'Somthing wrong' } };
            };
        } catch (err) {
            console.log(err)
            return { error: { message: err.response.data.message } };
        }
    },

    actionRemoveProduct: async (id, token) => {
        try {
            const resRemove = await removeProduct(id, token);

            if (resRemove.status === 200) {
                const res = await listInactiveProducts(6, token);

                if (res.status === 200) set({ inactiveProducts: res.data.result });

                return resRemove;
            } else {
                return { error: { message: 'Somthing wrong' } };
            };
        } catch (err) {
            console.log(err)
            return { error: { message: err.response.data.message } };
        }
    },

    actionCalllistOrdersAdmin: async (count, token) => {
        try {
            const res = await listOrdersAdmin(count, token);

            if (res.status === 200) {
                set({ orders: res.data.result });
                return res;
            } else {
                return { error: { message: 'Somthing wrong' } };
            };
        } catch (err) {
            console.log(err)
            return { error: { message: err.response.data.message } };
        }
    },

    actionUpdateTrackingOrder: async (id, data, token) => {
        try {
            const res = await updateOrder(id, data, token);

            if (res.status === 200) {
                const resList = await listOrdersAdmin(count, token);

                set({ orders: resList.data.result });

                return res;
            } else {
                return { error: { message: 'Somthing wrong' } };
            };
        } catch (err) {
            console.log(err)
            return { error: { message: err.response.data.message } };
        }
    },

    actionRemoveOrder: async (id, token) => {
        try {
            const res = await removeOrder(id, token);

            if (res.status === 200) {
                const resList = await listOrdersAdmin(count, token);

                set({ orders: resList.data.result });
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
    name: 'ecomStore-121167', // name of the item in the storage (must be unique)
    storage: createJSONStorage(() => localStorage),
    // storage: createJSONStorage(() => sessionStorage),
};

export const useEcomStore = create(persist(ecomStore, usePersist));