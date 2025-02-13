import { useEffect, useState } from "react";
import { getTokensFromCookie, isAuthenticated } from "../../services/api/userApi";
import { Navigate, redirect } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import { refreshToken as _refreshToken } from "../../services/api/userApi";

interface Props {
    children : any
    role? : string[]
}

const IsAuth = (props : Props) => {
    const [isAuth, setIsAuth] = useState(true);
    const {setTokens, refreshToken} = useAuthStore();

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
    }, []);

    if(isAuth){
        return <div>{props.children}</div>
    }
    else{
        return <></>
    }
    // return (
    //     <div className="h-full" onClick={() => setIsIdle(false)}>
    //         {
    //             isAuth && props.redirectTo ? props.children  : (<Navigate to={props.redirectTo!} />)
    //         }
    //         {
    //             isAuth && !props.redirectTo && props.children 
    //         }
    //     </div>
    // )
}

export default IsAuth;