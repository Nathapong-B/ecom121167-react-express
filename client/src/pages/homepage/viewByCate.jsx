import { useSearchParams } from "react-router-dom"

export default function ViewByCate(){
    const [searchParams]=useSearchParams();
    const cateId=searchParams.get('cateId');
    
    return(
        <div className="w-full max-w-6xl m-auto px-2 border border-red-500">
            <div>cate</div>
        </div>
    )
};