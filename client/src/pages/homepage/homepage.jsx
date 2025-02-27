import { Outlet, useOutlet } from "react-router-dom"
import { tokenExpire, tokenValidateRole } from "../auth/components/jwtValidate"
import { useEffect, useState } from "react";
import HomepageCover from "./homepageCover";
import { useAuthStore } from "../../ecomStore/authStore";
import { useShallow } from "zustand/react/shallow";
import { useCartStore } from "../../ecomStore/useCartStore";
import NavBar from "./navbar";
import Footer from "./components/footer";
import { signOut } from "../auth/components/signout";

export default function Homepage() {
    const { uId, token, actionRefreshToken } = useAuthStore(useShallow(s => ({
        uId: s.user?.sub,
        token: s.token,
        actionRefreshToken: s.actionRefreshToken,
    })));
    const path = window.location.pathname;
    const scrollRestoration = history.scrollRestoration;
    const [homeCoverClose, setHomeCoverClose] = useState(false);

    const hdlSignOut = () => {
        signOut({ isReload: true });
    };

    const tokenValid = async () => {
        if (!token) return;

        const tokenExp = tokenExpire(token);

        const min = Math.floor(tokenExp.expIn / 60);
        const sec = tokenExp.expIn % 60;

        if (min < 2) {
            console.log('lower 50')
            const res = await actionRefreshToken();

            if (res.error) {
                hdlSignOut();
            };
        };

        // console.log()
        // console.log(Object.keys(tokenExp)[1] + ':', min + 'min', sec + 'sec')
    };

    useEffect(() => {
        // ไม่ต้องให้คืนค่า scroll อัตโนมัติ เมื่อมีการรีโหลดหน้าเพจ เพื่อให้จัดการ scrollTop ด้วยตนเอง
        if (scrollRestoration === "auto") {
            history.scrollRestoration = "manual";
        };

        window.document.documentElement.scrollTop = 0;

        syncUserCart();

        window.addEventListener('focus', checkMultiTab);

        onclick = () => tokenValid();

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

            {path === '/' &&
                <div className={`h-screen w-full fixed top-0 z-50 ${coverHidden()}`}>
                    <HomepageCover close={hdlCoverClose} onClose={token ? true : false} />
                </div>
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