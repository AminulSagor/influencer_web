import { useAuthStore } from "@/store/auth_store";
import { getToken } from "./cookies_util";
import { decodeJwtPayload } from "./jwt_util";


export const initAuth = () => {
    const token = getToken();
    if (!token) return;

    const payload = decodeJwtPayload(token);
    if (!payload) return;

    // check expiry
    if (payload.exp && payload.exp * 1000 < Date.now()) return;

    useAuthStore.getState().
        setAuth({
            token,
            role: payload.role,
            phone: payload.phone,
            email: payload.email,
            isVerified: payload.isVerified,
        });
};
