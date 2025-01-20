import { useShallow } from "zustand/react/shallow";
import { useEcomStore } from "../../../ecomStore/useEcomStore";
import { useEffect } from "react";
import BlockProducts from "./blockProducts";

export default function ProductsBestSeller() {
    const { pBestSeller, callListProductsBy } = useEcomStore(useShallow(s => ({
        pBestSeller: s.pBestSeller,
        callListProductsBy: s.actionListProductsBy,
    })));

    useEffect(() => {
        if (!pBestSeller) {
            callListProductsBy(6, 'bestseller');
        }
    }, []);

    return (
        <div>
            <div className="block-title">สินค้าขายดี</div>
            <BlockProducts products={pBestSeller} />
        </div>
    )
};