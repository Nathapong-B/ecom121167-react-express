import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { changeStatusUser, listUsers, updateProfile, userSignin } from '../api/userApi';
import { jwtDecode } from 'jwt-decode';

const authStore = (set, get) => ({
    token: null,
    user: null,
    profile: null,

    actionSignin: async (payload) => {
        try {
            const res = await userSignin(payload);
            const decoded = jwtDecode(res.data.token);

            if (res.status === 200) {
                set({
                    token: res.data.token,
                    user: decoded,
                    profile: res.data.profile,
                });
                return { success: true, decoded };
            } else {
                return { error: { message: 'Somthing wrong' } };
            };
        } catch (err) {
            console.log(err);
            if (err?.code === "ERR_NETWORK") return { error: { message: err.message } };
            return { error: { message: err.response.data.message } };
        };
    },

    actionListUsers: async (statusby, count, token) => {
        try {
            const res = await listUsers(statusby, count, token);

            if (res.status === 200) {
                return res;
            } else {
                return { error: { message: 'Somthing wrong' } };
            };
        } catch (err) {
            console.log(err)
            return { error: { message: err.response.data.message } };
        }
    },

    actionChangeStatusUser: async (id, status, token) => {
        try {
            const data = status === 'active' ? { status: 'inactive' } : { status: 'active' };

            const res = await changeStatusUser(id, data, token);

            if (res.status === 200) {
                return res;
            } else {
                return { error: { message: 'Somthing wrong' } };
            };
        } catch (err) {
            console.log(err)
            return { error: { message: err.response.data.message } };
        }
    },

    actionUpdateProfile: async (payload, token) => {
        try {
            const res = await updateProfile(payload, token);

            if (res.status === 200) {
                set({ profile: res.data.result, });

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
    name: 'ecom-121167', // name of the item in the storage (must be unique)
    storage: createJSONStorage(() => localStorage),
    // storage: createJSONStorage(() => sessionStorage),
}

export const useAuthStore = create(persist(authStore, usePersist));
