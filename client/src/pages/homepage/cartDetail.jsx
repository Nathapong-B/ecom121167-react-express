import { useCartStore } from "../../ecomStore/useCartStore"
import { useShallow } from "zustand/react/shallow";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";
import { getImgPosition0 } from "../util/utilProduct";

export default function CartDetail() {
    const { cart, actionIncrease, actionDecrease, actionUpdateStock, actionRemoveFromCart, actionAddToOrder } = useCartStore(useShallow(s => ({
        cart: s.cart,
        actionIncrease: s.actionIncrease,
        actionDecrease: s.actionDecrease,
        actionUpdateStock: s.actionUpdateStock,
        actionRemoveFromCart: s.actionRemoveFromCart,
        actionAddToOrder: s.actionAddToOrder,
    })));
    const [productChecked, setProductChecked] = useState([]);
    const nav = useNavigate();

    document.title = 'Cart detail';

    const hdlIncrease = (item) => {
        const res = actionIncrease(item);
        if (res.error) return toast.warning(res.error.message);
    };

    const hdlDecrease = (item) => {
        const res = actionDecrease(item);
    };

    useEffect(() => {
        actionUpdateStock();
    }, []);

    const hdlProductChecked = (el, item) => {
        const { checked } = el.target;
        if (checked) {
            setProductChecked(prev => ([...prev, item]));
            return;
        } else {
            setProductChecked(prev => (prev.filter(e => e.id !== item.id)));
            return;
        };
    };

    const calSum = (items) => {
        const products = [...items];

        const cal = products.reduce((acc, cur) => {
            acc.qty += cur.qty;
            acc.total += (cur.qty * cur.price);
            return acc;
        }, { qty: 0, total: 0 });

        return { ...cal };
    };

    const hdlRemoveFromCart = (items) => {
        actionRemoveFromCart(items);
        clearChecked();
    };

    const hdlAllChecked = (e) => {
        const { checked } = e.target;
        const elsCheckbox = document.getElementsByName('check_box');

        if (checked) {
            for (let el of elsCheckbox) {
                el.checked = true;
            };

            setProductChecked([...cart]);
        } else {
            for (let el of elsCheckbox) {
                el.checked = false;
            };

            setProductChecked([]);
        };

    };

    const clearChecked = () => {
        const elsCheckbox = document.getElementsByName('check_box');
        for (let el of elsCheckbox) {
            el.checked = false;
        };
        setProductChecked([]);
    };

    const hdlOrder = (items) => {
        actionAddToOrder(items);
        clearChecked();
        nav('/main/order');
    };

    const viewProductDetail = (item) => {
        const { id } = item;
        const store = 'cart';

        nav({
            pathname: '/main/product-detail',
            search: createSearchParams({ pid: `${id}`, store }).toString()
        });
    };

    return (
        <div className="flex justify-center">
            <div className="w-full sm:w-10/12 md:w-9/12 xl:w-8/12 relative">
                <div className="flex flex-col items-center px-2">
                    <div className="block-title my-4">รายการสินค้าในตะกร้า</div>

                    <div className="mb-32">
                        <table className="bo-tb">
                            <thead>
                                <tr>
                                    <th className="w-1/12">
                                        <div className="flex justify-center">
                                            <input type="checkbox" onChange={(el) => hdlAllChecked(el)}></input>
                                        </div>
                                    </th>
                                    <th className="w-2/12">รูปภาพ</th>
                                    <th className="w-3/12">รายการ</th>
                                    <th className="w-2/12">จำนวน</th>
                                    <th className="w-2/12">ราคา/หน่วย</th>
                                    <th className="w-2/12">ราคารวม</th>
                                </tr>
                            </thead>
                            <tbody>

                                {cart
                                    ?
                                    cart.map((e, i) => (
                                        <tr key={i}>
                                            <td className="sm:text-center">
                                                <input name="check_box" type="checkbox" onChange={(el) => hdlProductChecked(el, e)}></input>
                                            </td>
                                            <td>
                                                <div onClick={() => viewProductDetail(e)} className="cursor-pointer bg-white p-2 rounded flex items-center h-8 w-8 sm:h-16 sm:w-16 m-auto">
                                                    <img src={getImgPosition0(e.Image)[0].url} className="object-contain"></img>
                                                </div>
                                            </td>
                                            <td>
                                                <div onClick={() => viewProductDetail(e)} className="cursor-pointer font-bold">
                                                    {e.product_name.toUpperCase()}
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <div className="flex justify-center">
                                                    <button onClick={() => hdlDecrease(e)} className="bo-btn-add text-red-500 hover:text-red-300 p-0">
                                                        <span>&#60;</span>
                                                        <span className="text-xs">ลด</span>
                                                    </button>
                                                    <div className="px-2">
                                                        {e.qty}
                                                    </div>
                                                    <button onClick={() => hdlIncrease(e)} className="bo-btn-add text-green-500 hover:text-green-300 p-0">
                                                        <span className="text-xs">เพิ่ม</span>
                                                        <span>&#62;</span>
                                                    </button>
                                                </div>

                                                <div className="text-center text-10px text-red-500">
                                                    <div>stock : {e.stock}</div>
                                                </div>
                                            </td>
                                            <td className="text-end">{e.price.toLocaleString('th-TH')}</td>
                                            <td className="text-end">{(e.price * e.qty).toLocaleString('th-TH')}</td>
                                        </tr>
                                    ))
                                    : <></>
                                }

                            </tbody>
                        </table>
                    </div>

                    {/* สรุปยอด */}
                    <div className="fixed bottom-0 pt-1 bg-gray-200 w-full sm:w-10/12 md:w-9/12 xl:w-8/12">
                        <div className="w-full">
                            <div className="flex text-sm">
                                <div className="w-5/12 sm:w-7/12 text-end">จำนวนรายการ</div>
                                <div className="w-4/12 sm:w-3/12 text-end pe-2">{productChecked.length}</div>
                                <div className="w-3/12 sm:w-2/12 ">รายการ</div>
                            </div>
                            <div className="flex text-sm">
                                <div className="w-5/12 sm:w-7/12 text-end">จำนวนหน่วย</div>
                                <div className="w-4/12 sm:w-3/12 text-end pe-2">{calSum(productChecked).qty}</div>
                                <div className="w-3/12 sm:w-2/12 ">รายการ</div>
                            </div>
                            <div className="flex font-bold">
                                <div className="w-5/12 sm:w-7/12 text-end">ยอดรวม</div>
                                <div className="w-4/12 sm:w-3/12 text-end pe-2">{calSum(productChecked).total.toLocaleString('th-TH')}</div>
                                <div className="w-3/12 sm:w-2/12 ">บาท</div>
                            </div>

                            <div className="text-end p-2 w-11/12">
                                <button onClick={() => hdlOrder(productChecked)} disabled={productChecked.length < 1} className="bo-btn-add bg-green-500 py-1 me-2 btn-disabled">สั่งซื้อ</button>
                                <button onClick={() => hdlRemoveFromCart(productChecked)} disabled={productChecked.length < 1} className="bo-btn-add bg-red-500 py-1 btn-disabled">ลบรายการที่เลือก</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )
};