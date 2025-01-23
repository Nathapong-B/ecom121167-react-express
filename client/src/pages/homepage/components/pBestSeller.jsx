import { useShallow } from "zustand/react/shallow";
import { useEcomStore } from "../../../ecomStore/useEcomStore";
import { useEffect } from "react";
import BlockProducts from "./blockProducts";
import { useCartStore } from "../../../ecomStore/useCartStore";

export default function ProductsBestSeller() {
    const { pBestSeller, callListProductsBy } = useEcomStore(useShallow(s => ({
        pBestSeller: s.pBestSeller,
        callListProductsBy: s.actionListProductsBy,
    })));
    const { addToCart } = useCartStore(useShallow(s => ({
        addToCart: s.actionAddToCart,
    })));

    useEffect(() => {
        if (!pBestSeller) {
            callListProductsBy(6, 'bestseller');
        }
    }, []);

    const hdlAddToCart = (data) => {
        const res = addToCart(data);

        if (!res) toast.error('สต๊อกไม่เพียงพอ..!!');
    };

    return (
        <div>
            <div className="block-title">สินค้าขายดี</div>
            <BlockProducts products={pBestSeller} returnData={hdlAddToCart} />
        </div>
    )
};