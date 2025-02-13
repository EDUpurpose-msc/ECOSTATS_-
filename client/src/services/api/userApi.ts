import axios from "axios";
import AuthToken from "../../types/AuthToken";
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "../../stores/useAuthStore";
import { Email } from "@mui/icons-material";

const apiUrl : string = import.meta.env.VITE_API_URL;


export const login = async (data : {email : string, password : string}) : Promise<AuthToken|null> => {
    try {
        const res = await axios.post(`${apiUrl}/users/login`, data);
        const authToken : AuthToken = {
            accessToken : res.data.accessToken,
            refreshToken : res.data.refreshToken
        }
        return authToken;
    } catch (error) {
        console.log(error)
        return null;
    }
}

export const loginV2 = async (data : {email : string, password : string}) : Promise<any> => {
    const res = await axios.post(`${apiUrl}/users/login`, data);
    return res;

}

export const getAllUsers = async (page:number, limit:number, name?:string|null) : Promise<any> => {
    try {
        let query = `page=${page}&limit=${limit}`;
        if(name){
            query += `&name=${name}`;
        }
        const res = await axios.get(`${apiUrl}/users?${query}`);
        return res.data;
    } catch (error) {
        console.log(error)
        return null;
    }
}

export const refreshToken = async (data : {refreshToken : string}) : Promise<AuthToken|null> => {
    try {
        const res = await axios.post(`${apiUrl}/users/refresh-token`, data);
        const authToken : AuthToken = {
            accessToken : res.data.accessToken,
            refreshToken : res.data.refreshToken
        }
        return authToken;
    } catch (error) {
        console.log(error)
        return null;
    }
}

export const isAuthenticated =  async () : Promise<boolean> => {
    try {
        const _accessToken = Cookies.get("accessToken");
        const _refreshToken = Cookies.get("refreshToken")

        if(!_accessToken)
            return false;

        const decodedAccessToken = jwtDecode(_accessToken)
        const isExpired = decodedAccessToken.exp! * 1000 < Date.now();

        if(isExpired){
            Cookies.remove("accessToken");
            return false;
        }

        const newToken : AuthToken|null = await refreshToken({refreshToken: _refreshToken});
        if(!newToken){
            throw("Unable to refresh token")
        }
        Cookies.set("accessToken", newToken.accessToken, {expires: 7});
        Cookies.set("refreshToken", newToken.refreshToken, {expires: 7});

        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
}

export const getTokensFromCookie = () : AuthToken => {
    const accessToken = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken")
    return {
        accessToken,
        refreshToken
    }
}

export const signup = async (data : {email : string, password : string, name : string, role : string}) : Promise<void> => {
    await axios.post(`${apiUrl}/users/signup`, data);
}

export const registerUser = async (data : {email : string, password : string,password_confirmation : string, name : string, role : string}) : Promise<void> => {
    await axios.post(`${apiUrl}/users/register-user`, data);
}

export const getUserById = async (id : string) : Promise<any> => {
    return await axios.get(`${apiUrl}/users/get-by-id/${id}`);
}

export const activateUser = async (id : string) : Promise<any> => {
    return await axios.post(`${apiUrl}/users/activate/${id}`);
}

export const deactivateUser = async (id : string) : Promise<any> => {
    return await axios.post(`${apiUrl}/users/deactivate/${id}`);
}

export const updateUser = async (id : string, name : string, email : string, role : string) : Promise<any> => {
    return await axios.put(`${apiUrl}/users/update/${id}`, { name, email, role });
}

export const searchUserByName = async (name : string) : Promise<any> => {
    return await axios.get(`${apiUrl}/users/search/${name}`,);
}

export const assignTo = async (userId : string, programId : string|null, unitId : string|null) : Promise<any> => {
    return await axios.post(`${apiUrl}/users/assign-to`, {
        userId, programId, unitId
    });
}

export const getByQuery = async (query : any) : Promise<any> => {
    return await axios.get(`${apiUrl}/users/query`, {
        params: {
            query : query
        }
    });
}

export const forgotPassword = async (body) : Promise<any> => {
    return await axios.post(`${apiUrl}/users/forgot-password`, body);
}

export const resetPassword = async (password, token) : Promise<any> => {
    return await axios.post(`${apiUrl}/users/reset-password/${token}`, {
        password
    });
}
export const resendEmailVerification = async (email) : Promise<any> => {
    return await axios.post(`${apiUrl}/users/resend-verification/${email}`);
}

export const isEmailUsed = async (email) : Promise<any> => {
    return await axios.get(`${apiUrl}/users/is-email-used/${email}`);
}

export const getReportCount = async (_id) : Promise<any> => {
    return await axios.get(`${apiUrl}/users/count-reports-for-approval/${_id}`);
}

export const deleteUser = async (_id) : Promise<any> => {
    return await axios.delete(`${apiUrl}/users/delete/${_id}`);
}

export const getAdminOverviewData = async (year : number) : Promise<any> => {
    return await axios.get(`${apiUrl}/users/admin-overview-data`, {
        params : {
            year : year
        }
    });
}
