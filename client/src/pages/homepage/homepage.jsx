import { Outlet } from "react-router-dom"
import { tokenExpire, tokenValidateRole } from "../auth/components/jwtValidate"
import { useEffect, useState } from "react";
import HomepageCover from "./homepageCover";
import { useAuthStore } from "../../ecomStore/authStore";
import { useShallow } from "zustand/react/shallow";
import { useCartStore } from "../../ecomStore/useCartStore";
import NavBar from "./navbar";
import Footer from "./components/footer";

export default function Homepage() {
    // const token = useAuthStore(s => s.token);
    const { uId, token } = useAuthStore(useShallow(s => ({
        uId: s.user?.sub,
        token: s.token,
    })));
    const path = window.location.pathname;
    const [homeCoverClose, setHomeCoverClose] = useState(false);

    useEffect(() => {
        syncUserCart();

        window.addEventListener('focus', checkMultiTab);

    }, []);

    const syncUserCart = () => {
        // ตรวจสอบไอดียูส กับตะกร้าต้องตรงกัน
        const localName = useCartStore.persist.getOptions().name;
        if (uId && !localName[localName.search(uId)]) {
            return location.reload();
        };
    };

    // checkMultiTab กรณีเปิดหลายแท็ป
    const checkMultiTab = () => {
        // ตรวจสอบไอดีในlocal กับใน state ถ้าไม่ตรงกันให้ reload เกิดขึ้นในกรณีที่ออกจากระบบหรือเข้าสู่ระบบจากแท็ปอื่น
        const local = localStorage.getItem(useAuthStore.persist.getOptions().name);
        const sub = JSON.parse(local)?.state.user.sub;
        if (uId !== sub) {
            return location.reload();
        };
    };

    const hdlCoverClose = (data) => {
        setHomeCoverClose(data);
    };

    const coverHidden = () => {
        if (homeCoverClose) return "hidden";
        return "";
    };

    return (
        <div className="relative w-full min-h-screen p-0 m-0 flex flex-col bg-main">

            {path === '/'
                ?
                <div className={`h-screen w-full fixed top-0 z-50 ${coverHidden()}`}>
                    <HomepageCover close={hdlCoverClose} onClose={token ? true : false} />
                </div>
                : <></>
            }

            <div className="sticky top-0 w-full z-40">
                <NavBar />
            </div>

            <div className="z-10 flex-1">
                <Outlet />
            </div>

            {/* footer */}
            <div className="w-full h-20 bg-gray-300">
                <Footer />
            </div>

        </div>
    )
}