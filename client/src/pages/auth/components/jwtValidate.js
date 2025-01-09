import { jwtDecode } from "jwt-decode";

export const tokenExpire = (token) => {
    const decoded = jwtDecode(token);
    const time = Math.floor(Date.now() / 1000);
    const expIn = decoded.exp - time;

    if (expIn < 0) {
        return ({ message: 'token expire', expIn });
    } else {
        return ({ message: 'token ok', expIn });
    };
};

export const tokenValidateRole = (token) => {
    const decoded = jwtDecode(token);
    return decoded.role;
};