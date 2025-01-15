import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "../../ecomStore/authStore";
import FormProfile from "./components/formProfile";

export default function ProfileAccount() {
    const { profile } = useAuthStore(useShallow(s => ({
        profile: s.profile,
    })));

    return (
        <div>
            <div className="bo-title">Account Management</div>

            {profile
                ?
                <FormProfile data={profile} />
                : <></>
            }
        </div>
    )
};