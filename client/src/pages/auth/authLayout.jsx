import { Link, Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div className="w-full min-w-max h-screen bg-gray-200 flex flex-col items-center">

            {/* <div className="mt-16 mb-12 text-gray-500 font-bold text-xl">My Page</div> */}

            {/* <div className="flex flex-col w-1/3 min-w-max h-max py-10 rounded rounded-md bg-white/30"> */}
            <div className="w-full min-w-max m-auto">

                {/* <div className="self-center">
                    <Link to={'/'} className="text-gray-500 font-bold">Home</Link>
                </div>

                <div className="self-center mb-5">
                    <Link to={'signin'}>Sing in</Link>
                    <span> / </span>
                    <Link to={'register'}>Register</Link>
                </div> */}

                <div className="w-full min-w-max self-center">
                    <Outlet />
                </div>

            </div>

        </div>
    )
}