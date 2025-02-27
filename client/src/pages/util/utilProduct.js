import { getEachProduct } from "../../api/productApi";
import { useCartStore } from "../../ecomStore/useCartStore";
import { useEcomStore } from "../../ecomStore/useEcomStore";

export const getImgPosition0 = (items) => {
    const arrimg = [...items];
    return arrimg.filter(e => e.position === 0);
};

export const getProductDetail = async (pid, store) => {
    const myPurchase = useCartStore.getState().myPurchase;
    const { products, pNewArrival, pBestSeller } = useEcomStore.getState();
    const cart = useCartStore.getState().cart;

    const fethData = async (pid) => {
        try {
            const res = await getEachProduct(pid);
            if (res.status === 200) {
                return res;
            } else {
                return { error: { message: 'Somthing wrong' } };
            };
        } catch (err) {
            console.log(err);
            if (err?.code === "ERR_NETWORK") return { error: { message: err.message } };
            return { error: { message: err.response.data.message } };
        }
    };

    if (store === 'myPurchase' && myPurchase) {
        for (let e of myPurchase) {
            const { OrderDetail } = e;

            const pFound = OrderDetail.filter(i => i.Product.id === pid);

            if (pFound.length > 0) {
                const { Product } = pFound[0];
                return [Product];
            };
        };
    };

    if (store === 'pNewArrival' && pNewArrival) {
        const pFound = pNewArrival.filter(e => e.id === pid);

        if (pFound.length > 0) {
            return pFound;
        };
    };

    if (store === 'pBestSeller' && pBestSeller) {
        const pFound = pBestSeller.filter(e => e.id === pid);

        if (pFound.length > 0) {
            return pFound;
        };
    };

    if (store === 'products' && products) {
        const pFound = products.filter(e => e.id === pid);

        if (pFound.length > 0) {
            return pFound;
        };
    };

    if (store === 'cart' && cart) {
        const pFound = cart.filter(e => e.id === pid);

        if (pFound.length > 0) {
            return pFound;
        };
    };

    return await fethData(pid);
};