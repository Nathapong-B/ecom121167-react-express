import { useState } from "react"
import dayjs from "dayjs";
import MyModal from "../../../MyModal";

export default function OrderInfo(props) {
    const { User } = props.data;
    const [data, setData] = useState(props.data ?? null);

    return (
        <MyModal>
            <div className="bo-title text-center">Order info</div>
            <div className="flex">
                <div className="ps-6 mb-4 flex-1">
                    <div className="font-bold">รายละเอียดคำสั่งซื้อ</div>
                    <div className="ps-4">
                        <div><span className="font-bold">Id : </span>{data.id}</div>
                        <div><span className="font-bold">Create date : </span>{dayjs(data.create_date).format('DD-MM-YYYY HH:mm:ss')}</div>
                        <div><span className="font-bold">Pay date : </span>{data.StripePayment[0].pay_date ? dayjs(new Date(parseInt(data.StripePayment[0].pay_date) * 1000)).format('DD-MM-YYYY HH:mm:ss') : '-'}</div>
                        <div><span className="font-bold">Customer name : </span>{data.customer_name}</div>
                        <div><span className="font-bold">Customer address : </span>{data.customer_address}</div>
                        <div><span className="font-bold">Customer phone : </span>{data.customer_phone}</div>
                    </div>
                </div>

                <div className="ps-6 mb-4 flex-1">
                    <div className="font-bold">ข้อมูลลูกค้า</div>
                    <div className="ps-4">
                        <div><span className="font-bold">Id : </span>{User.id}</div>
                        <div><span className="font-bold">Email : </span>{User.email}</div>
                        <div><span className="font-bold">Fullname : </span>{User.first_name ?? '-'} {User.last_name ?? '-'}</div>
                        <div><span className="font-bold">Address : </span>{User.address ?? '-'}</div>
                        <div><span className="font-bold">Phone : </span>{User.phone ?? '-'}</div>
                        <div><span className="font-bold">Register date : </span>{dayjs(User.create_date).format('DD-MM-YYYY HH:mm:ss')}</div>
                    </div>
                </div>
            </div>

            <div className="text-start ps-6 flex-1">
                <div className="flex justify-between p-2">
                    <div><span className="font-bold">Status : </span>{data.status}</div>
                    <div><span className="font-bold">Tracking No. : </span>{data.tracking_no}</div>
                </div>
                <table className="bo-tb">
                    <thead>
                        <tr>
                            <th className="w-7/12">รายการ</th>
                            <th className="">ราคา/หน่วย</th>
                            <th className="w1/12">จำนวน</th>
                            <th>รวม</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data
                            ?
                            data.OrderDetail.map((e, i) => (
                                <tr key={i}>
                                    <td className="px-2">{e.Product.product_name}</td>
                                    <td className="text-end px-2">{e.price.toLocaleString('th-TH')}</td>
                                    <td className="text-center">{e.quantity}</td>
                                    <td className="text-end px-2">{e.total_orderDetail.toLocaleString('th-TH')}</td>
                                </tr>
                            ))
                            : <></>}
                    </tbody>
                </table>
                <div className="text-end px-4 py-2 font-bold">ยอดรวม : {data.total_order.toLocaleString('th-TH')} บาท</div>

            </div>

            <div className="text-center">
                <button className="bo-btn-add bg-sky-500" onClick={() => props.close(null)}>OK,</button>
            </div>
        </MyModal>
    )
};