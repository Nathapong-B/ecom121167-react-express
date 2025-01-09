import { useEffect, useState } from "react";
import { useAuthStore } from "../../../ecomStore/authStore"
import { useEcomStore } from "../../../ecomStore/useEcomStore";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useShallow } from "zustand/react/shallow";
import { printPDF } from "./orders/createPDF";
import OrderInfo from "./orders/orderInfo";

export default function ListOrdersAdmin() {
    const token = useAuthStore(s => s.token);
    const { callListOrder, updateTracking,removeOrder } = useEcomStore(
        useShallow(s => ({
            callListOrder: s.actionCalllistOrdersAdmin,
            updateTracking: s.actionUpdateTrackingOrder,
            removeOrder:s.actionRemoveOrder,
        }))
    );
    const [listOrders, setListOrders] = useState();
    const [onEdit, setOnEdit] = useState();
    const [newTracking, setNewTracking] = useState('');
    const [info, setInfo] = useState(false);

    const hdlCallListOrders = async () => {
        const res = await callListOrder(6, token);

        if (res.status === 200) {
            setListOrders(res.data.result);
        } else if (res.error) {
            toast.error(`${res.error.message}`);
        };
    };

    const setCssStatus = (status) => {
        //pending confirmed shipping completed canceled
        if (status === 'pending') return 'bo-btn-add bg-orange-500';
        if (status === 'confirmed') return 'bo-btn-add bg-yellow-500';
        if (status === 'shipping') return 'bo-btn-add bg-sky-500';
        if (status === 'completed') return 'bo-btn-add bg-green-500';
        if (status === 'canceled') return 'bo-btn-add bg-gray-500';
    };

    const hdlClickEditTracking = (index, tracking_no) => {
        setOnEdit(parseInt(index));
        setNewTracking(() => tracking_no ?? '');
    };

    const hdlInputTracking = (e) => {
        setNewTracking(e.target.value);
    };

    const hdlSaveEditTracking = async (item) => {
        const id = item.id;
        const data = { tracking_no: newTracking };
        const status = item.status;

        // alert if status is pending
        if (status === 'pending') {
            const eventSwal = await Swal.fire({
                title: 'Order has not been confirmed yet',
                icon: 'warning',
                showCancelButton: true,
            });

            if (!eventSwal?.isConfirmed) return false;
        };

        const res = await updateTracking(id, data, token);

        //completed
        if (res.status === 200) {
            await hdlCallListOrders();
            setNewTracking('');
            setOnEdit();
            toast.success(`${res.data.message}`);
        } else if (res.error) {
            toast.error(`${res.error.message}`);
        };
    };

    const hdlCancelEditTracking = () => {
        setOnEdit();
        setNewTracking('');
    };

    const hdlOrderList = (e) => {
        const list = e.OrderDetail;
        let arrList = [];

        list.map(el => arrList.push(el.Product.product_name));

        return arrList;
    };

    const hdlOrderlistClick = (i) => {
        const el = document.querySelector(`#ol_orderlist${i}.h-auto`);

        el ? el.classList.remove('h-auto') : document.getElementById(`ol_orderlist${i}`).classList.add('h-auto');
    };

    const hdlPrintPDF = (data) => {
        printPDF(data);
    };

    const hdlOrderInfo = (data) => {
        setInfo(data);
    };

    const hdlRemoveOrder = async(e) => {
        const {id}=e;

        const res=await removeOrder(id,token);

        if (res.status === 200) {
            await hdlCallListOrders();
            toast.success(`${res.data.message}`);
        } else if (res.error) {
            toast.error(`${res.error.message}`);
        };
    };

    useEffect(() => {
        hdlCallListOrders();
    }, []);

    const debug = () => {
        // const { User, OrderDetail } = listOrders[0];
        // console.log('user : ', User)
        // console.log('order detail : ', OrderDetail)
        console.log(listOrders)
    }

    return (
        <div>
            {/* <button className="bo-btn-add" onClick={debug}>debug</button> */}

            {info ?
                <OrderInfo data={info} close={hdlOrderInfo} />
                : <></>}

            <div>
                <table className="bo-tb">
                    <thead>
                        <tr>
                            <th>Customer name</th>
                            <th>Order list</th>
                            <th>Total</th>
                            <th>Tracking No.</th>
                            <th>Status</th>
                            <th>Manage</th>
                        </tr>
                    </thead>

                    <tbody>
                        {listOrders
                            ?
                            listOrders.map((e, i) => (
                                onEdit === i
                                    ?
                                    <tr key={i} className="tb-tr-hover">
                                        <td className="ps-2">
                                            <div className="h-6 text-ellipsis overflow-hidden" >
                                                {e.customer_name}
                                            </div>
                                        </td>
                                        <td className="ps-2 text-sm cursor-pointer" onClick={() => hdlOrderlistClick(i)}>
                                            <ol id={`ol_orderlist` + i} className="h-auto">
                                                {hdlOrderList(e).map((el, inx) => (
                                                    <li key={inx} className="text-ellipsis overflow-hidden">{(inx + 1) + '. ' + el}</li>
                                                ))}
                                            </ol>
                                        </td>
                                        <td className="text-end pe-2">{e.total_order.toLocaleString('th-TH')}</td>
                                        <td>
                                            <input className="frm-input w-full h-full p-0" value={newTracking} onChange={(el) => hdlInputTracking(el)} autoFocus></input>
                                        </td>
                                        <td className="text-center ps-2">
                                            <button className={`${setCssStatus(e.status)}`}>{e.status}</button>
                                        </td>
                                        <td className="text-center">
                                            <button className="bo-btn-add bg-green-500 px-1 me-2" onClick={() => hdlSaveEditTracking(e)}>Save</button>
                                            <button className="bo-btn-add bg-gray-500 px-1" onClick={() => hdlCancelEditTracking()}>Cancel</button>
                                        </td>
                                    </tr>
                                    :
                                    <tr key={i} className="tb-tr-hover">
                                        <td className="ps-2">
                                            <div className="h-6 text-ellipsis overflow-hidden" >
                                                {e.customer_name}
                                            </div>
                                        </td>
                                        <td className="ps-2 text-sm cursor-pointer" onClick={() => hdlOrderlistClick(i)}>
                                            <ol id={`ol_orderlist` + i} className="h-6">
                                                {hdlOrderList(e).map((el, inx) => (
                                                    <li key={inx} className="text-ellipsis overflow-hidden">{(inx + 1) + '. ' + el}</li>
                                                ))}
                                            </ol>
                                        </td>
                                        <td className="text-end pe-2">{e.total_order.toLocaleString('th-TH')}</td>
                                        <td className="ps-2 cursor-text" onClick={() => hdlClickEditTracking(i, e.tracking_no)}>{e.tracking_no}</td>
                                        <td className="text-center ps-2">
                                            <button className={`${setCssStatus(e.status)}`}>{e.status}</button>
                                        </td>
                                        <td className="text-center">
                                            <button className="bo-btn-add bg-sky-500 px-1 me-1" onClick={() => hdlOrderInfo(e)}>info</button>
                                            <button className="bo-btn-add bg-green-500 px-1 me-1" onClick={() => hdlPrintPDF(e)}>Print</button>
                                            <button className="bo-btn-add bg-red-500 px-1" onClick={() => hdlRemoveOrder(e)}>X</button>
                                        </td>
                                    </tr>
                            ))
                            : <></>}
                    </tbody>
                </table>
            </div>
        </div>
    )
};