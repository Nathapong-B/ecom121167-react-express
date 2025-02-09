import { Link, Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div className="w-full min-w-max h-screen bg-gray-200 flex flex-col items-center">
            <div className="w-full min-w-max m-auto">
                <div className="w-full min-w-max self-center">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}