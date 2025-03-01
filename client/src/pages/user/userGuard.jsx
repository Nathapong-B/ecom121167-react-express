import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../ecomStore/authStore";
import { tokenExpire, tokenValidateRole } from "../auth/components/jwtValidate";

export default function UserGuard({ element }) {
    const token = useAuthStore(s => s.token);

    const jwtValidate = () => {
        if (!token) return { permission: false, path: '/main', search: '?permission=false&message=unauthorized', message: 'Unauthorized, Please sign-in' };

        const tokenExp = tokenExpire(token);

        if (tokenExp.expIn > 0) {
            return { permission: true };
        };

        return { permission: false, path: '/main', search: '?permission=false&message=tokenexpire', message: 'Token expire' };
    };

    return jwtValidate().permission ? element : <Navigate to={{ pathname: jwtValidate().path, search: jwtValidate().search }} />;
};