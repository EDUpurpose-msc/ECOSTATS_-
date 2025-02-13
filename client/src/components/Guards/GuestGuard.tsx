import { ReactNode, useEffect, useState } from "react";
import { getTokensFromCookie, isAuthenticated } from "../../services/api/userApi";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";

interface Props {
    children: ReactNode;
    redirectTo?: string;
}

const GuestGuard = (props : Props) => {
    const [isAuth, setIsAuth] = useState(false);
    const {setTokens} = useAuthStore();

    useEffect(() => {
        const checkAuth = async () => {
            const isAuthenticatedStatus = await isAuthenticated();
            setIsAuth(isAuthenticatedStatus);
            if(isAuthenticatedStatus){
                setTokens(getTokensFromCookie())
            }
        };

        checkAuth();
    }, [])

    return (
        <>
            { !isAuth && props.redirectTo  ? props.children  : (<Navigate to={props.redirectTo!} />) }
            { !isAuth && !props.redirectTo && props.children }
        </>
    )
}

export default GuestGuard;