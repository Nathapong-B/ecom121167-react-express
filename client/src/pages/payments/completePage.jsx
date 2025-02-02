import { Link } from "react-router-dom";
import ProductRecommend from "../homepage/components/pRecommend";

export default function CompletePage() {
    return (
        <div className="w-full max-w-4xl m-auto">

            <div className="w-full h-52 m-auto content-center my-4 rounded rounded-lg box-shadow-normal">
                <div className="text-center font-bold text-3xl">Payment Completed</div>
                <div className="text-center my-2 text-sm">
                    <button className="bo-btn-add bg-red-400 me-2 py-1">ไปหน้าประวัติคำสั่งซื้อ</button>
                    <Link to={'/main'}>
                    <button className="bo-btn-add bg-sky-500 py-1">กลับหน้าหลัก</button>
                    </Link>
                </div>
            </div>

            <div className="w-full justify-items-center py-4">
                <div className="block-display">
                    <ProductRecommend />
                </div>
            </div>

        </div>
    )
};