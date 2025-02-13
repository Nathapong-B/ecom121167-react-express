import { useAuthStore } from "../../ecomStore/authStore";
import { tokenExpire, tokenValidateRole } from "../auth/components/jwtValidate";
import { Navigate, useNavigate } from "react-router-dom";

export default function AdminGuard({ element }) {
    const token = useAuthStore(s => s.token);

    const jwtValidate = () => {
        if (!token) return { permission: false, path: '/redirect', search: '?permission=false&message=unauthorized', message: 'Unauthorized, Please sign-in' };

        const tokenExp = tokenExpire(token);
        const role = tokenValidateRole(token);

        if (tokenExp.expIn > 0 && role === 'admin') {
            return { permission: true };
        };

        return { permission: false, path: '/redirect', search: '?permission=false&message=tokenexpire', message: 'Token expire' };
    };

    return jwtValidate().permission ? element : <Navigate to={{ pathname: jwtValidate().path, search: jwtValidate().search }} />;
    // return jwtValidate() ? element : <Navigate to={{ pathname: '/redirect', search: '?permission=false' }} />;
};