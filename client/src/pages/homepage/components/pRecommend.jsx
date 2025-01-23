import { useEffect } from "react"
import { useEcomStore } from "../../../ecomStore/useEcomStore";
import { useShallow } from "zustand/react/shallow";
import BlockProducts from "./blockProducts";
import { useCartStore } from "../../../ecomStore/useCartStore";

export default function ProductRecommend() {
    const { products, callListProduct } = useEcomStore(useShallow(s => ({
        products: s.products,
        callListProduct: s.actionCallListProduct,
    })));
    const { addToCart } = useCartStore(useShallow((s) => ({
        addToCart: s.actionAddToCart,
    })));

    const callProducts = async () => {
        const res = await callListProduct(6);
        res.error ? alert(`${res.error.message}`) : '';
    };

    useEffect(() => {
        if (!products) {
            callProducts();
        };
    }, []);

    const hdlAddToCart = (data) => {
        const res = addToCart(data);

        if (!res) toast.error('สต๊อกไม่เพียงพอ..!!');
    };

    return (
        <div>
            <div className="block-title">สินค้าแนะนำ</div>
            <BlockProducts products={products} returnData={hdlAddToCart} />
        </div>
    )
};