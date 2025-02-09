import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "../../ecomStore/authStore";
import FormProfile from "../backoffice/components/formProfile";
import PageNotFound from "../404Page";

export default function MyProfile() {
    const { profile } = useAuthStore(useShallow(s => ({
        profile: s.profile,
    })));

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