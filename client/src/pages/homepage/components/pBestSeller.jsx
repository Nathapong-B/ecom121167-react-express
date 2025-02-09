import { useShallow } from "zustand/react/shallow";
import { useEcomStore } from "../../../ecomStore/useEcomStore";
import { useEffect } from "react";
import BlockProducts from "./blockProducts";
import { useCartStore } from "../../../ecomStore/useCartStore";
import { toast } from "react-toastify";
import { createSearchParams, useNavigate } from "react-router-dom";

export default function ProductsBestSeller() {
    const { pBestSeller, callListProductsBy } = useEcomStore(useShallow(s => ({
        pBestSeller: s.pBestSeller,
        callListProductsBy: s.actionListProductsBy,
    })));
    const { addToCart } = useCartStore(useShallow(s => ({
        addToCart: s.actionAddToCart,
    })));
    const nav = useNavigate();

    useEffect(() => {
        if (!pBestSeller) {
            callListProductsBy(6, 'bestseller');
        }
    }, []);

    const hdlAddToCart = (data) => {
        const res = addToCart(data);

        if (res.error) toast.warning(res.error.message);

        if (res.success) toast.success(res.success.message);
    };

    const viewProductDetail = (item) => {
        const { id } = item;
        const store = 'pBestSeller';

        nav({
            pathname: '/main/product-detail',
            search: createSearchParams({ pid: `${id}`, store }).toString()
        });
    };

    return (
        <div>
            <div className="block-title">สินค้าขายดี</div>
            <BlockProducts products={pBestSeller} returnData={hdlAddToCart} returnViewProduct={viewProductDetail} />
        </div>
    )
};