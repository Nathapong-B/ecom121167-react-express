import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom"
import { searchProduct } from "../../api/productApi";
import { useEffect, useState } from "react";
import BoxSearch from "./components/boxSearch";
import BlockProducts from "./components/blockProducts";
import { useEcomStore } from "../../ecomStore/useEcomStore";
import { useCartStore } from "../../ecomStore/useCartStore";
import { useShallow } from "zustand/shallow";
import { toast } from "react-toastify";

export default function ViewByGroup() {
    const [searchParams] = useSearchParams();
    const category_id = searchParams.get('category_id');
    const product_name = searchParams.get('product_name');
    const price_s = searchParams.get('price_s');
    const price_e = searchParams.get('price_e');
    const categories = useEcomStore(s => s.categories);
    const { addToCart } = useCartStore(useShallow((s) => ({
        addToCart: s.actionAddToCart,
    })));

    const [data, setData] = useState();
    const nav = useNavigate();

    document.title = 'Search';

    const fetchData = async () => {
        try {
            const price = (!price_s || !price_e) ? [] : [price_s, price_e];
            const payload = { category_id: category_id ? [category_id] : [], product_name, price };
            const res = await searchProduct(payload);

            if (res.status === 200) {
                setData(res.data.result);
            }
        } catch (err) {
            console.log(err)
        };
    };

    const hdlReceiveBoxSearch = (data) => {
        // console.log('recieve : ', data)

        const { category_id, product_name, price } = data;

        const params = {};

        if (category_id) params.category_id = category_id;
        if (product_name) params.product_name = product_name;
        if (price) {
            params.price_s = price[0]
            params.price_e = price[1]
        };

        // console.log(params)

        nav({
            pathname: '/main/view-by-group',
            search: createSearchParams(params).toString()
        });

    };

    const searchTitle = () => {
        let arrText = [];

        if (category_id) {
            const filter = categories.filter(item => item.id === category_id);
            arrText.push('หมวดหมู่ : ' + filter[0].category_name)
        };

        if (product_name) arrText.push('ชื่อสินค้า : ' + product_name);

        if (price_s && price_e) arrText.push('ช่วงราคา : ' + price_s + ' - ' + price_e)

        return arrText;
    };

    useEffect(() => {
        fetchData()
    }, [searchParams]);

    const hdlAddToCart = (data) => {
        const res = addToCart(data);

        if (res.error) toast.warning(res.error.message);

        if (res.success) toast.success(res.success.message);
    };

    const viewProductDetail = (item) => {
        const { id } = item;
        // const store = 'products';

        nav({
            pathname: '/main/product-detail',
            search: createSearchParams({ pid: `${id}` }).toString()
        });
    };

    return (
        <div className="w-full px-6">
            <div className="w-full max-w-6xl m-auto">
                <div className="flex">

                    {/* side bar */}
                    <div className="w-3/12 py-4 justify-items-center">
                        <BoxSearch data={{ category_id, product_name, price_s, price_e }} returnData={hdlReceiveBoxSearch} />
                    </div>

                    {/* main contents */}
                    <div className="w-9/12 py-4 ps-2">
                        <div>
                            <span className="font-bold">ค้นหา</span>
                            {
                                searchTitle().map((e, i) => (
                                    <div key={i} className="inline text-sm">
                                        <div className="inline mx-2 text-red-500">&#187;</div>
                                        {e}
                                    </div>
                                ))
                            }

                        </div>
                        {data?.length > 0
                            ? <BlockProducts products={data} returnData={hdlAddToCart} returnViewProduct={viewProductDetail} />
                            : <div className="p-5">&#10007; ไม่พบข้อมูล</div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
};