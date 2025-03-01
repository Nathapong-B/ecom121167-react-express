import { useSearchParams } from "react-router-dom"
import { getProductDetail } from "../util/utilProduct";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ImagesDisplay from "./components/imgDisplay";
import ProductRecommend from "./components/pRecommend";
import { useCartStore } from "../../ecomStore/useCartStore";
import { useShallow } from "zustand/react/shallow";

export default function ProductDetail() {
    const [searchParams] = useSearchParams();
    const pid = searchParams.get('pid');
    const store = searchParams.get('store');
    const { addToCart } = useCartStore(useShallow((s) => ({
        addToCart: s.actionAddToCart,
    })));
    const scrollRestoration = history.scrollRestoration;
    const [data, setData] = useState();
    data?.Image.sort((a, b) => a.position - b.position); // sort image position

    document.title = data?.product_name ? data.product_name.toUpperCase() : 'Product detail';

    const fetchData = async () => {
        const res = await getProductDetail(pid, store);

        if (res?.length > 0) {
            setData(res[0]);
        };

        if (res.error) return toast.error(res.error.message);

        if (res.status === 200) {
            setData(res.data.result);
        };
    };

    const hdlAddToCart = (data) => {
        const res = addToCart(data);

        if (res.error) toast.warning(res.error.message);

        if (res.success) toast.success(res.success.message);
    };

    useEffect(() => {
        // ไม่ต้องให้คืนค่า scroll อัตโนมัติ เมื่อมีการรีโหลดหน้าเพจ เพื่อให้จัดการ scrollTop ด้วยตนเอง
        if (scrollRestoration === "auto") {
            history.scrollRestoration = "manual";
        };

        window.document.documentElement.scrollTop = 0;

        fetchData();
    }, [pid]);

    return (
        <div className="w-full max-w-4xl m-auto px-2">

            {data &&
                <div className="w-full min-h-max m-auto mt-6 flex flex-col gap-2 md:flex-row">

                    {/* image display */}
                    <div className="w-3/5 md:max-w-lg">
                        <ImagesDisplay data={data?.Image} />
                    </div>

                    {/* product description */}
                    <div className="relative w-2/5 flex flex-col mx-auto p-2 bg-white rounded">
                        <div className="font-bold text-xl text-gray-500">{data.product_name.toUpperCase()}</div>

                        <div>{data.description}</div>

                        <div className="mx-auto font-bold text-red-500 text-center">
                            <span>ราคา </span>
                            <span className="text-2xl"> {data.price.toLocaleString('th-TH')} </span>
                            <span> บาท</span>

                            <div className="text-center">
                                <button className="bo-btn-add bg-sky-500" onClick={() => hdlAddToCart(data)}>+ ADD TO CART</button>
                            </div>
                        </div>
                    </div>

                </div>
            }

            <div className="w-full justify-items-center py-4">
                <div className="block-display p-0">
                    <ProductRecommend />
                </div>
            </div>
        </div>
    )
};