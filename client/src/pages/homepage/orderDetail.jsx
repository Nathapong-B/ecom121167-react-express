import { useShallow } from "zustand/react/shallow"
import { useCartStore } from "../../ecomStore/useCartStore"
import { useAuthStore } from "../../ecomStore/authStore";
import { createSearchParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoadingCover from "../loadingCover";
import { getImgPosition0 } from "../util/utilProduct";
import { profileSchema } from "../auth/components/zodConfig";

export default function OrderDetail() {
    const { profile, token } = useAuthStore(useShallow(s => ({
        profile: s.profile,
        token: s.token,
    })));
    const { order, actionClearOrder, actionCreateOrder, actionRemoveFromCart } = useCartStore(useShallow(s => ({
        order: s.order,
        actionClearOrder: s.actionClearOrder,
        actionCreateOrder: s.actionCreateOrder,
        actionRemoveFromCart: s.actionRemoveFromCart,
    })));
    const nav = useNavigate();
    const [addressForOrder, setAddressForOrder] = useState();
    const [addressCheck, setAddressCheck] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    document.title = 'Order detail';

    const calSum = (items) => {
        const products = [...items];

        const cal = products.reduce((acc, cur) => {
            acc.qty += cur.qty;
            acc.total += (cur.qty * cur.price);
            return acc;
        }, { qty: 0, total: 0 });

        return { ...cal };
    };

    const hdlCancel = () => {
        const res = actionClearOrder();
        if (res.success) return nav('/main/cart');
    };

    const hdlApplyAddress = (userAddress) => {
        const userProfile = { ...userAddress };

        setAddressForOrder(() => ({
            first_name: userProfile.first_name,
            last_name: userProfile.last_name,
            phone: userProfile.phone,
            address: userProfile.address,
        }));
    };

    const hdlOnAddressChange = (e) => {
        const { id, value } = e.target;

        setAddressForOrder(prev => ({
            ...prev,
            [id]: value,
        }));
    };

    const checkAddress = (item) => {
        const userAddress = { ...item };

        const { error } = profileSchema.safeParse(userAddress);

        let err = {};
        if (error) {
            err = error.issues.reduce((acc, cur) => {
                acc = {
                    ...acc,
                    [cur.path[0]]: cur.message
                };

                return acc;
            }, {});
        };

        setErrors(() => ({ ...err }));

        if(error){
            return setAddressCheck(false);
        }else{
            return setAddressCheck(true);
        };

        // if (!userAddress.first_name || !userAddress.last_name || !userAddress.phone || !userAddress.address) {
        //     return setAddressCheck(false);
        // } else {
        //     return setAddressCheck(true);
        // };
    };

    const prepareData = (dataOrder, dataCustomer, token) => {
        let order = [];
        const customerDetail = {
            customer_name: dataCustomer.first_name + ' ' + dataCustomer.last_name,
            customer_address: dataCustomer.address,
            customer_phone: dataCustomer.phone,
        };

        dataOrder.map(e =>
            order.push({
                id: e.id,
                quantity: e.qty,
            })
        );

        return { order, customerDetail };
    };

    const hdlCreateOrder = async () => {
        setIsLoading(true);
        const payload = prepareData(order, addressForOrder);
        const res = await actionCreateOrder(payload, token);

        if (res.error) return toast.error(res.error.message);

        if (res.status === 200) {
            const amount = calSum(order).total.toLocaleString('th-TH');
            //ถ้าได้รับ clientsecret แล้ว ให้เคลียร์ order ใน global state และลบ สินค้าใน cart
            actionClearOrder();
            actionRemoveFromCart(order);

            nav({
                pathname: '/payments',
                search: createSearchParams({ cs: `${res.data.clientSecret}`, amount }).toString()
            })
        }

        setIsLoading(false);

    };

    useEffect(() => {
        if (order.length < 1) {
            nav('/main/cart');
        };

        checkAddress(addressForOrder);

    }, [addressForOrder]);

    return (
        <div className="flex flex-col items-center md:flex-row md:items-start md:justify-center max-w-4xl lg:m-auto">

            <LoadingCover title="กำลังไปสู่หน้าต่างชำระเงิน" isLoading={isLoading}></LoadingCover>

            <div className="w-full sm:w-10/12 md:w-4/12 mt-16 px-2">
                <div className="text-xs bg-green-500/30 border border-green-500 rounded p-2 mb-2">
                    <div className="text-center font-bold">ที่อยู่ปัจจุบัน</div>

                    {profile.first_name
                        ?
                        <div>
                            <div>คุณ {profile.first_name} {profile.last_name}</div>
                            <div>โทร {profile.phone}</div>
                            <div>{profile.address}</div>
                        </div>
                        :
                        <div>
                            <div>ยังไม่มีข้อมูลที่อยู่ในระบบ</div>
                            <div>
                                <Link to={'/profile/my-profile'} className="text-blue-500 hover:text-gray-50">
                                    คลิกเพื่อกรอกข้อมูล
                                </Link>
                            </div>
                        </div>
                    }
                    <div className="text-end ">
                        <button disabled={!profile.first_name} onClick={() => hdlApplyAddress(profile)} className="mt-1 bg-green-500/50 py-1 px-2 rounded border border-green-500 hover:text-white hover:bg-green-500 btn-disabled">
                            ใช้ที่อยู่นี้
                        </button>
                    </div>

                </div>

                <div className="w-full h-96 bg-white p-2 rounded">
                    <div className="text-gray-500 text-center">ที่อยู่สำหรับจัดส่ง</div>

                    <div>
                        <div className="pb-10">
                            <div className={errors.first_name?`order-label-animate w-5 text-red-500`:`order-label-animate w-5 text-green-500 border-green-500`}>
                                <label htmlFor="first_name">ชื่อ</label>
                                <input id="first_name" placeholder="First Name" value={addressForOrder?.first_name ?? ''} onChange={(e) => hdlOnAddressChange(e)}></input>
                            </div>
                        </div>
                        <div className="pb-10">
                            <div className={errors.last_name?`order-label-animate w-14 text-red-500`:`order-label-animate w-14 text-green-500 border-green-500`}>
                                <label htmlFor="last_name">นามสกุล</label>
                                <input id="last_name" placeholder="Last Name" value={addressForOrder?.last_name ?? ''} onChange={(e) => hdlOnAddressChange(e)}></input>
                            </div>
                        </div>
                        <div className="pb-10">
                            <div className={errors.phone?`order-label-animate w-28 text-red-500`:`order-label-animate w-28 text-green-500 border-green-500`}>
                                <label htmlFor="phone">หมายเลขโทรศัพท์</label>
                                <input id="phone" placeholder="Phone" value={addressForOrder?.phone ?? ''} onChange={(e) => hdlOnAddressChange(e)}></input>
                            </div>
                        </div>
                        <div>
                            <div className={errors.address?`order-label-animate w-8 text-red-500`:`order-label-animate w-8 text-green-500 border-green-500`}>
                                <label htmlFor="address">ที่อยู่</label>
                                <textarea id="address" className="resize-none min-w-max w-full absolute top-6 left-0 text-gray-500 text-base focus:bg-white focus:outline-none" rows={5} placeholder="Address" value={addressForOrder?.address ?? ''} onChange={(e) => hdlOnAddressChange(e)}></textarea>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className="w-full sm:w-10/12 md:w-8/12">
                <div className="flex flex-col items-center px-2">
                    <div className="block-title my-4">รายละเอียดคำสั่งซื้อ</div>

                    <div className="w-full">

                        {order
                            ?
                            order.map((e, i) => (
                                <div key={i} className="flex p-4 mb-2 bg-white rounded">
                                    <div className="bg-white p-2 rounded flex items-center h-14 w-14 sm:h-24 sm:w-24 m-auto">
                                        <img src={getImgPosition0(e.Image)[0].url} className="object-contain"></img>
                                    </div>

                                    <div className="flex-1 flex flex-col px-2">
                                        <div className="flex justify-between">
                                            <div className="pe-2 font-bold">{e.product_name.toUpperCase()}</div>
                                            <div className="flex justify-center items-center w-5 h-5 text-10px text-gray-500 rounded rounded-full bg-gray-200">
                                                <div>
                                                    {i + 1}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-red-500 text-xs">
                                            <div className="ps-2">x{e.qty}</div>
                                            <div className="ps-2">{e.price.toLocaleString('th-TH')}.- / หน่วย</div>
                                        </div>
                                        <div className="flex-1 flex justify-end items-end">
                                            <div>รวม {(e.price * e.qty).toLocaleString('th-TH')} บาท</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                            : <></>
                        }

                    </div>

                    {/* สรุปยอด */}
                    <div className="pt-1 bg-gray-200 w-full flex flex-col items-end">
                        <div className="w-2/3">
                            <div className="flex text-sm">
                                <div className="w-5/12 sm:w-6/12 text-end">จำนวนรายการ</div>
                                <div className="w-4/12 sm:w-3/12 text-end pe-2">{order.length}</div>
                                <div className="w-3/12 sm:w-3/12 ">รายการ</div>
                            </div>
                            <div className="flex text-sm">
                                <div className="w-5/12 sm:w-6/12 text-end">หน่วยรวม</div>
                                <div className="w-4/12 sm:w-3/12 text-end pe-2">{calSum(order).qty}</div>
                                <div className="w-3/12 sm:w-3/12 ">หน่วย</div>
                            </div>
                            <div className="flex font-bold">
                                <div className="w-5/12 sm:w-6/12 text-end">ยอดรวม</div>
                                <div className="w-4/12 sm:w-3/12 text-end pe-2">{calSum(order).total.toLocaleString('th-TH')}</div>
                                <div className="w-3/12 sm:w-3/12 ">บาท</div>
                            </div>

                            <div className="text-end p-4">
                                <button onClick={() => hdlCreateOrder()} className="bo-btn-add bg-green-500 py-1 me-2 btn-disabled" disabled={!addressCheck}>
                                    ชำระเงิน
                                    <span className="ms-2 text-sm">&#3647;{calSum(order).total.toLocaleString('th-TH')}</span>
                                </button>
                                <button onClick={() => hdlCancel()} className="bo-btn-add bg-red-500 py-1 btn-disabled">ยกเลิก</button>
                            </div>
                        </div>

                        <div className="w-full text-center">
                            <div className="text-red-500 text-sm">**กรอก ชื่อ-ที่อยู่ ให้ครบถ้วน และตรวจสอบให้ถูกต้อง ก่อนทำการสั่งซื้อ</div>
                        </div>
                    </div>

                </div>
            </div>

        </div >
    )
};