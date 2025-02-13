import { useEffect, useState } from "react";
import { getTokensFromCookie, isAuthenticated } from "../../services/api/userApi";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import { refreshToken as _refreshToken } from "../../services/api/userApi";

interface Props {
    children : any
    role? : string[]
}

const RouteGuard = (props : Props) => {
    const [isAuth, setIsAuth] = useState(true);
    const {setTokens, refreshToken, user} = useAuthStore();

    const [isIdle, setIsIdle] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            if(!isIdle){
                _refreshToken({refreshToken: refreshToken!})
                .then(token => {
                    setTokens(token!)
                })
                .catch((err) => {
                    console.log(err)
                })
            }
        }, 300000);
        return () => clearInterval(interval);
    }, [refreshToken, isIdle]);

    useEffect(() => {
        const checkAuth = async () => {
            const isAuthenticatedStatus = await isAuthenticated();
            setIsAuth(isAuthenticatedStatus);
            if(isAuthenticatedStatus){
                setTokens(getTokensFromCookie())
            }
        };

        checkAuth();
    }, [user]);

    if (!isAuth) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="h-full" onClick={() => setIsIdle(false)}>
            {props.children}
        </div>
    );

    // if (user?.verifiedAt) {
    //     return (
    //         <div className="h-full" onClick={() => setIsIdle(false)}>
    //             {props.children}
    //         </div>
    //     );
    // }

    // if (user && !user?.verifiedAt) {
    //     return <Navigate to={`/verify-email/${user?.email}`} />;
    // }
    
}

export default RouteGuard;
