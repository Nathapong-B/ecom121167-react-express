import { createSearchParams, Link } from "react-router-dom"
import { tokenExpire, tokenValidateRole } from "../auth/components/jwtValidate"
import { useAuthStore } from "../../ecomStore/authStore"
import LoadingCover from "../loadingCover";
import { useRef, useState } from "react";
import HomepageCover from "./components/homepageCover";


export default function Homepage() {
    // const token = useAuthStore(s => s.token);
    // const debug = () => {
    //     const res = tokenExpire(token);
    //     console.log(res)
    //     console.log(typeof (tokenValidateRole(token)))
    // };
    // const [isLoadingCoverPage, setIsLoadingCoverPage] = useState(false);

    return (
        <div className="relative">

            <HomepageCover />

            {/* contents */}
            <div>
                <div className="w-full h-screen">Contents Page</div>
            </div>

        </div>
    )
}