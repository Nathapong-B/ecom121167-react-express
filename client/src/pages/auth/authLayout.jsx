import { Link, Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div className="w-full h-screen bg-gray-200 flex justify-center items-center">
            <div className="flex flex-col w-1/2 h-1/2">
                <div className="self-center">
                    <Link to={'/'} className="text-gray-500 font-bold">Home</Link>
                </div>
                <div className="self-center mb-5">

                    <Link to={'signin'}>Sing in</Link>
                    <span> / </span>
                    <Link to={'register'}>Register</Link>
                </div>
                <div className="self-center">
                    <Outlet />
                </div>
            </div>

        </div>
    )
}