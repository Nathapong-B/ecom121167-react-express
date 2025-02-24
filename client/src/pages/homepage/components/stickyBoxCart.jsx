import { createSearchParams, Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../../../ecomStore/useCartStore";
import Card from "./card";

export default function StickyBoxCart() {
    const cart = useCartStore(s => s.cart);
    const product = cart[0];
    const nav = useNavigate();

    const viewProductDetail = (item) => {
        const { id } = item;
        const store = 'cart';

        nav({
            pathname: '/main/product-detail',
            search: createSearchParams({ pid: `${id}`, store }).toString()
        });
    };

    return (
        <Card style={"bg-gray-100"}>
            <div className="card-title pt-2 text-gray-500">
                <Link to={'/main/cart'}>สินค้าในตะกร้า</Link>
            </div>
            <hr className="w-10/12 m-auto my-2 border-gray-400"></hr>

            <div className="p-2 px-6 text-xs">
                <div className="text-xs text-gray-500 mb-1">เพิ่มล่าสุด</div>
                {product
                    ?
                    <div>
                        <div>
                            <img src={product.Image[0].url} className="cursor-pointer rounded" onClick={() => viewProductDetail(product)} />
                        </div>

                        <div className="flex justify-between mt-2">
                            <div className="font-bold truncate pe-2 cursor-pointer" onClick={() => viewProductDetail(product)}>{product.product_name.toUpperCase()}</div>
                            <div className="text-red-500">&#3647;{product.price.toLocaleString('th-TH')}</div>
                        </div>

                        <div className="text-end text-gray-500">qty. {product.qty} ชิ้น</div>

                        <div className="text-end mt-2 cursor-pointer hover:text-sky-500">
                            <Link to={'/main/cart'}>...เพิ่มเติม</Link>
                        </div>
                    </div>
                    :
                    <div className="text-center text-gray-500 pb-4">ยังไม่มีสินค้าในตะกร้า</div>
                }
            </div>
        </Card>
    )
};