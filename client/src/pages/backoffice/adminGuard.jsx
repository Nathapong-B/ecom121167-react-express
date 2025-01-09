import { useAuthStore } from "../../ecomStore/authStore";
import { tokenExpire, tokenValidateRole } from "../auth/components/jwtValidate";
import { Navigate } from "react-router-dom";

export default function AdminGuard({ element }) {
    const token = useAuthStore(s => s.token);

    const jwtValidate = () => {
        const tokenExp = tokenExpire(token);
        const role = tokenValidateRole(token);

        if (tokenExp.expIn > 0 && role === 'admin') {
            return true;
        };

        return false;
    };

    return jwtValidate() ? element : <Navigate to={{ pathname: '/redirect', search: '?permission=false' }} />;
};