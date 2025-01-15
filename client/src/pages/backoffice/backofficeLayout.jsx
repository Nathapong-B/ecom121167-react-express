import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "./sidebar";

export default function BackOfficeLayout() {
    const navigate = useNavigate();

    const hdlUnloadPage = () => {
        // console.log('unload');
        localStorage.removeItem('ecomStore-121167');
    };

    useEffect(() => {
        const path = window.location.pathname;
        const backoffice = ['/backoffice', '/backoffice/'];

        // หาก pathname มีค่าเท่ากับ backoffice ให้ไปที่หน้า dashboard หากไม่ใช่ เมื่อทำการรีเฟรซ ให้อยู่ที่ path เดิม
        if (backoffice.includes(path)) navigate('dashboard');

        window.addEventListener('beforeunload', hdlUnloadPage)
    }, []);

    // console.log('back office')

    return (
        <div className="flex bg-gray-200 gap-0">
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