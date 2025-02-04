import { useSearchParams } from "react-router-dom"
import { getProductDetail } from "../util/product";

export default function ProductDetail() {
    const [searchParams] = useSearchParams();
    const pid = searchParams.get('pid');
    const store = searchParams.get('store');

    const debug = () => {
        const st='myPurchase';
        const res = getProductDetail(pid,store)
        console.log(res)
    }

    return (
        <div className="w-full max-w-4xl m-auto border border-green-500">
            <div>Product id : {pid}</div>
            <div>From store : {store}</div>
            <button className="bo-btn-add bg-green-500" onClick={debug}>debug</button>
        </div>
    )
};