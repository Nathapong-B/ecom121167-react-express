import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "../../ecomStore/authStore";
import FormProfile from "../backoffice/components/formProfile";
import PageNotFound from "../404Page";
import { useEffect } from "react";

export default function MyProfile() {
    const { profile } = useAuthStore(useShallow(s => ({
        profile: s.profile,
    })));
    const scrollRestoration = history.scrollRestoration;

    document.title = 'Profile';

    useEffect(() => {
        // ไม่ต้องให้คืนค่า scroll อัตโนมัติ เมื่อมีการรีโหลดหน้าเพจ เพื่อให้จัดการ scrollTop ด้วยตนเอง
        if (scrollRestoration === "auto") {
            history.scrollRestoration = "manual";
        };

        document.documentElement.scrollTop = 0;

    }, []);

    return (
        <div className="pt-6">
            {profile
                ?
                <div>
                    <FormProfile data={profile} />
                </div>
                : <PageNotFound />
            }
        </div>
    )
};