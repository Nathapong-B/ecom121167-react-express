import { useShallow } from "zustand/react/shallow"
import { useEcomStore } from "../../../ecomStore/useEcomStore"
import { useEffect } from "react";
import BlockProducts from "./blockProducts";

export default function ProductsNewArrival() {
    const { pNewArrival, callListProductsBy } = useEcomStore(useShallow(s => ({
        pNewArrival: s.pNewArrival,
        callListProductsBy: s.actionListProductsBy,
    })));

    useEffect(() => {
        if (!pNewArrival) {
            callListProductsBy(6, 'newarrival');
        }
    }, []);

    return (
        <div>
            <div className="block-title">สินค้ามาใหม่</div>
            <BlockProducts products={pNewArrival} />
        </div>
    )
};