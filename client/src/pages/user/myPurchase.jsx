import { useShallow } from "zustand/react/shallow"
import { useCartStore } from "../../ecomStore/useCartStore"
import { useEffect } from "react";
import { useAuthStore } from "../../ecomStore/authStore";
import { toast } from "react-toastify";
import PageNotFound from "../404Page";
import MyPurchaseTable from "./components/myPurchaseTable";
import { useSearchParams } from "react-router-dom";

export default function MyPurchase() {
    const [searchParams] = useSearchParams();
    const ms = searchParams.get('ms'); // ms=message

    const { token } = useAuthStore(useShallow(s => ({ token: s.token })));
    const { myPurchase, actionListMyPurchase, actionClearMyPurchase, actionRemoveOrder } = useCartStore(useShallow(s => ({
        myPurchase: s.myPurchase,
        actionListMyPurchase: s.actionListMyPurchase,
        actionClearMyPurchase: s.actionClearMyPurchase,
        actionRemoveOrder: s.actionRemoveOrder,
    })));

    document.title = 'Purchase';

    const callListMyPurchase = async () => {
        await actionListMyPurchase(10, token);

        // if (res.error) return toast.error(res.error.message);
    };

    const hdlClearMyPurchase = () => {
        // ใส่เงื่อนไขเช็ค pathname เนื่องจากฟังก์ชันจะยังทำงานแม้อยู่ในหน้าอื่น
        if (location.pathname === '/profile/my-purchase') {
            actionClearMyPurchase()
        };
    };

    const hdlRemoveOrder = async (item) => {
        const { id } = item;
        const res = await actionRemoveOrder(id, token);

        if (res.error) return toast.error(res.error.message);

        if (res.status === 200) {
            toast.success(res.data.message);
        };
    };

    useEffect(() => {
        if (ms === 'payment-completed') {
            callListMyPurchase();
        };

        if (myPurchase.length < 1) {
            callListMyPurchase();
        };

        window.addEventListener('beforeunload', hdlClearMyPurchase)
    }, []);

    return (
        <div className="w-full max-w-6xl m-auto">

            {token
                ? myPurchase.length > 0
                    ?
                    <MyPurchaseTable data={myPurchase} returnRemoveOrder={hdlRemoveOrder} />
                    :
                    <div className="text-center font-bold text-2xl text-gray-500 italic py-6">- ยังไม่มีข้อมูลประวัติคำสั่งซื้อ -</div>
                :
                // 404 page
                <PageNotFound />
            }

        </div>
    )
};