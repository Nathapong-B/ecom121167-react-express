import { Outlet } from "react-router-dom"
import { tokenExpire, tokenValidateRole } from "../auth/components/jwtValidate"
import { useEffect, useState } from "react";
import HomepageCover from "./homepageCover";
import { useAuthStore } from "../../ecomStore/authStore";
import { useShallow } from "zustand/react/shallow";
import { useCartStore } from "../../ecomStore/useCartStore";

export default function Homepage() {
    const { uId } = useAuthStore(useShallow(s => ({
        uId: s.user?.sub,
    })));
    const path = window.location.pathname;
    const [homeCoverClose, setHomeCoverClose] = useState(false);

    useEffect(() => {
        const localName = useCartStore.persist.getOptions().name;

        if (uId && !localName[localName.search(uId)]) {
            window.location.reload();
        }

    }, []);

    const hdlCoverClose = (data) => {
        setHomeCoverClose(data);
    };

    const coverHidden = () => {
        if (homeCoverClose) return "hidden";
        return "";
    };

    return (
        <div className="relative w-full flex flex-col bg-main">

            {path === '/'
                ?
                <div className={`h-screen w-full fixed top-0 z-50 ${coverHidden()}`}>
                    <HomepageCover close={hdlCoverClose} />
                </div>
                : <></>
            }

            <div className="z-10">
                <Outlet />
            </div>

        </div>
    )
}