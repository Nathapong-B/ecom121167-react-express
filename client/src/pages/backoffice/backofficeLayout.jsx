import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "./sidebar";
import { useAuthStore } from "../../ecomStore/authStore";
import { useShallow } from "zustand/react/shallow";

export default function BackOfficeLayout() {
    const { uId } = useAuthStore(useShallow(s => ({
        uId: s.user?.sub,
    })));
    const navigate = useNavigate();

    document.title = 'Back office';

    const hdlUnloadPage = () => {
        localStorage.removeItem('ecomStore-121167');
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

    useEffect(() => {
        const path = window.location.pathname;
        const backoffice = ['/backoffice', '/backoffice/'];

        // หาก pathname มีค่าเท่ากับ backoffice ให้ไปที่หน้า dashboard หากไม่ใช่ เมื่อทำการรีเฟรซ ให้อยู่ที่ path เดิม
        if (backoffice.includes(path)) navigate('dashboard');

        window.addEventListener('focus', checkMultiTab);

        window.addEventListener('beforeunload', hdlUnloadPage);
    }, []);

    return (
        <div className="flex bg-main gap-0">
            {/* side bar */}
            <div className="bg-gray-900 w-1/5 min-w-min text-center pt-5 h-screen">
                <SideBar />
            </div>

            {/* content */}
            <div className="w-4/5 h-screen overflow-y-auto p-5">
                <Outlet />
            </div>

        </div>
    )
};