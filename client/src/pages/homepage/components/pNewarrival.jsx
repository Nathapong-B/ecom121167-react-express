import { useShallow } from "zustand/react/shallow"
import { useEcomStore } from "../../../ecomStore/useEcomStore"
import { useEffect } from "react";
import BlockProducts from "./blockProducts";
import { useCartStore } from "../../../ecomStore/useCartStore";

export default function ProductsNewArrival() {
    const { pNewArrival, callListProductsBy } = useEcomStore(useShallow(s => ({
        pNewArrival: s.pNewArrival,
        callListProductsBy: s.actionListProductsBy,
    })));
    const { addToCart } = useCartStore(useShallow(s => ({
        addToCart: s.actionAddToCart,
    })));

    useEffect(() => {
        if (!pNewArrival) {
            callListProductsBy(6, 'newarrival');
        }
    }, []);

    const hdlAddToCart = (data) => {
        const res = addToCart(data);

        if (!res) toast.error('สต๊อกไม่เพียงพอ..!!');
    };

    return (
        <div>
            <div className="block-title">สินค้ามาใหม่</div>
            <BlockProducts products={pNewArrival} returnData={hdlAddToCart} />
        </div>
    )
};