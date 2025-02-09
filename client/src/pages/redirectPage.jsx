import { useEffect, useState } from "react";
import { useAuthStore } from "../ecomStore/authStore";
import { Navigate, useSearchParams } from "react-router-dom";
import LandingPage from "./landingPage";

export default function redirectPage() {
    const user = useAuthStore(state => state.user);
    const [count, setCount] = useState(0);
    const numToRedirect = 3;

    // permission ส่งมาจาก adminGuard หากมีค่า จะเซ็ตค่า title ให้ LandingPage เป็น permission denied
    const [searchParmas] = useSearchParams();
    const permission = searchParmas.get('permission');

    const redirectTo = () => {
        if (user?.role === 'user' || permission) { return <Navigate to={'/'} /> };
        if (user?.role === 'admin') { return <Navigate to={'/backoffice'} /> };
    };

    const runInterval = () => {
        const interval = setInterval(() => {
            setCount(c => {
                if (c === numToRedirect) {
                    clearInterval(interval);
                    return numToRedirect;
                };
                return c += 1;
            });
        }, 1000);
    };

    useEffect(() => {
        runInterval();
    }, []);

    if (count === numToRedirect) {
        return redirectTo();
    };

    const mapDot = () => {
        return (
            Array(count >= 3 ? count % 3 : count).fill(null).map(() => {
                return '.'
            })
        );
    };

    return (
        <>
            {user?.role === 'user' || permission
                ?
                <div className="w-full h-screen flex justify-center items-center">
                    <div>
                        <LandingPage title={permission ? 'Permission denied' : 'Welcom to Home Page'} />
                        <div className="flex justify-center text-gray-500">
                            <div className="flex-1 text-end">redirect.</div>
                            <div className="flex-1 ">{mapDot()}</div>
                        </div>
                    </div>
                </div>
                :
                <div className="w-full h-screen flex justify-center items-center">
                    <div>
                        <LandingPage title={'Welcom to Admin Panel'} />
                        <div className="flex justify-center text-gray-500">
                            <div className="flex-1 text-end">redirect.</div>
                            <div className="flex-1 ">{mapDot()}</div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
};