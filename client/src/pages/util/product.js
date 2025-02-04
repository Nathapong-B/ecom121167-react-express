import { useCartStore } from "../../ecomStore/useCartStore";
import { useEcomStore } from "../../ecomStore/useEcomStore";

export const getProductDetail = (pid, store) => {
    const myPurchase = useCartStore.getState().myPurchase;
    const { products, pNewArrival, pBestSeller } = useEcomStore.getState();
    // console.log(products)
    // console.log(pNewArrival)
    // console.log(pBestSeller)
    //pBestSeller , pNewArrival , products
    // myPurchase[].OrderDetail[].Product

    if (store === 'myPurchase') {
        for (let e of myPurchase) {
            const { OrderDetail } = e;

            const pFound = OrderDetail.filter(i => i.Product.id === pid);

            if (pFound.length > 0) {
                const { Product } = pFound[0];
                return Product;
            };
        };
    };

    if (store === 'pNewArrival') {
        return pNewArrival.filter(e => e.id === pid);
    };

    if (store === 'pBestSeller') {
        return pBestSeller.filter(e => e.id === pid);
    };

    if (store === 'products') {
        return products.filter(e => e.id === pid);
    };
};