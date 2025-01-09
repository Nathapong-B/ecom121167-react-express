import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { userSignin } from '../api/userApi';
import { jwtDecode } from 'jwt-decode';

const authStore = (set, get) => ({
    token: null,
    user: null,

    actionSignin: async (payload) => {
        const res = await userSignin(payload);
        const decoded = jwtDecode(res.data.token);

        set({
            token: res.data.token,
            user: decoded,
        });

        return res;
    },
});

const usePersist = {
    name: 'ecom-121167', // name of the item in the storage (must be unique)
    storage: createJSONStorage(() => localStorage),
    // storage: createJSONStorage(() => sessionStorage),
}

export const useAuthStore = create(persist(authStore, usePersist));
