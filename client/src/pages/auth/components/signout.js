import { useAuthStore } from "../../../ecomStore/authStore";

export const signOut = ({ isReload = true } = {}) => {
    const localName = useAuthStore.persist.getOptions().name;
    localStorage.removeItem(localName);

    if (isReload) window.location.reload();

    return;
};