import dayjs from "dayjs";
import { createSearchParams, useNavigate } from "react-router-dom";
import { getImgPosition0 } from "../../util/utilProduct";

export default function MyPurchaseTable(props) {
    const { data } = props;
    const nav = useNavigate();

    const settingStatusColor = (status) => {
        if (status === 'pending') return 'bg-gradient-to-r from-white from-50% to-orange-500 to-80%';
        if (status === 'confirmed') return 'bg-gradient-to-r from-white from-50% to-yellow-500 to-80%';
        if (status === 'shipping') return 'bg-gradient-to-r from-white from-50% to-sky-500 to-80%';
        if (status === 'completed') return 'bg-gradient-to-r from-white from-50% to-green-500 to-80%';
        if (status === 'canceled') return 'bg-gradient-to-r from-white from-50% to-gray-500 to-80%';
    };

    const hdlRemoveOrder = (item) => {
        //อัพเดทสถานะออร์เดอร์ แล้วเรียกรายการออร์เดอร์ใหม่อีกครั้ง
        props.returnRemoveOrder(item)
    };

    const hdlCheckout = (item) => {
        const { client_secret } = item.StripePayment[0];
        const amount = item.total_order;

        nav({
            pathname: '/payments',
            search: createSearchParams({ cs: `${client_secret}`, amount }).toString()
        });
    };

    const viewProductDetail = (item) => {
        const { id } = item.Product;
        const store = 'myPurchase';

        nav({
            pathname: '/main/product-detail',
            search: createSearchParams({ pid: `${id}`, store }).toString()
        });
    };

    return (
        <div className="p-4">

            {data &&
                <div>
                    {data.map((e, i) => (
                        <div key={i} className="my-6">

                            {/* order overview */}
                            <div className="bg-white p-2 px-4 rounded">
                                <div className={`flex justify-between px-2 py-1 mb-2 rounded-t border-b border-gray-200 text-gray-50 ${settingStatusColor(e.status)}`}>
                                    <div className="text-black text-sm">{e.tracking_no && `หมายเลขพัสดุ : ${e.tracking_no}`}</div>
                                    <div>{e.status.toUpperCase()}</div>
                                </div>

                                <div className="flex text-sm">
                                    <div className="flex-1">
                                        <div>
                                            <span className="me-2">ที่อยู่จัดส่ง : คุณ{e.customer_name}</span>
                                            <span className="me-2">{e.customer_phone}</span>
                                            <span>{e.customer_address}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <div>
                                                รายการสินค้า : {e.OrderDetail.length} รายการ
                                            </div>
                                            <div className="font-bold">Order Total : &#3647;{e.total_order.toLocaleString('th-TH')}</div>
                                        </div>

                                        <div className="text-xs text-gray-500">
                                            วันที่สร้าง : {dayjs(e.create_date).format('DD MMMM YYYY เวลา HH:mm')}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* order detail */}
                            <div className="mx-4 bg-gray-50 rounded-b p-2 px-4 text-sm">
                                {e.OrderDetail.map((el, inx) => (
                                    <div key={inx} className="py-2">
                                        <div className="flex gap-4 pb-2">
                                            <div onClick={() => viewProductDetail(el)} className="cursor-pointer">
                                                <img src={getImgPosition0(el.Product.Image)[0].url} className="object-contain h-16 w-16"></img>
                                            </div>

                                            <div className="flex-1">
                                                <div onClick={() => viewProductDetail(el)} className="cursor-pointer font-bold">{el.Product.product_name.toUpperCase()}</div>
                                                <div>x{el.quantity}</div>

                                                <div className="flex justify-between">
                                                    <div>&#3647;{el.price.toLocaleString('th-TH')} / หน่วย</div>
                                                    <div>รวมรายการนี้ : &#3647;{el.total_orderDetail.toLocaleString('th-TH')}</div>
                                                </div>
                                            </div>
                                        </div>
                                        {inx < e.OrderDetail.length - 1 && <hr className="border border-gray-200"></hr>}
                                    </div>
                                ))}
                            </div>

                            {/* footer - ถ้าสถานะ ขำระเงินแล้ว ไม่ต้องแสดงปุ่ม ยกเลิก */}
                            {e.status === 'pending' &&
                                <div className="bg-white p-2 px-4 rounded">
                                    <div className="text-end">
                                        <button onClick={() => hdlCheckout(e)} className="bo-btn-add bg-sky-500 text-gray-100 outline outline-1 outline-sky-500 py-1 hover:bg-sky-400 hover:text-black me-2">ชำระเงิน</button>

                                        <button onClick={() => hdlRemoveOrder(e)} className="bo-btn-add bg-red-500/0 text-red-500 outline outline-1 outline-red-500 py-1 hover:bg-red-500 hover:text-gray-100">ยกเลิกคำสั่งซื้อ</button>
                                    </div>
                                </div>
                            }

                        </div>
                    ))}
                </div>
            }

        </div>
    )
};