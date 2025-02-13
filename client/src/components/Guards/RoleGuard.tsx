import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import { ReactNode, useEffect } from "react";
import ErrorPage from "../../pages/ErrorPage/ErrorPage";

const RoleGuard = ({role, children} : { role : string[], children : ReactNode}) => {

    const authStore = useAuthStore();

    if(role.includes(authStore.user?.role!)){
        return <>{children}</>
    }
    return <ErrorPage code={401} message={"Unauthorized Access"} />
}

export default RoleGuard;