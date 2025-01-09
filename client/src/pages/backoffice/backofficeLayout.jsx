import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "./sidebar";

export default function BackOfficeLayout() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('dashboard')
    }, []);

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