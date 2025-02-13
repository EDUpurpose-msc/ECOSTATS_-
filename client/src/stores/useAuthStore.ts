import { create } from "zustand";
import AuthToken from "../types/AuthToken";
import { User } from "../types/User";
import Cookies from "js-cookie"

interface AuthState {
    accessToken : string|null,
    refreshToken : string|null,
    user : User|null

    setAccessToken : (token : string) => void,
    clearAccessToken : () => void,
    setRefreshToken : (token : string) => void,
    clearRefreshToken : () => void,
    setTokens : (token : AuthToken) => void,
    clearTokens : () => void,
    setUser : (user:User|null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    refreshToken : null,
    user : null, // current authenticated user

    setUser: (user : User|null) => set({user: user}),

    setAccessToken: (token) => {
        set({ accessToken: token })
        Cookies.set("accessToken", token, { expires:7});
    },
    clearAccessToken: () => {
        set({ accessToken: null })
        Cookies.remove("accessToken");
    },

    setRefreshToken : (token) => {
        set({refreshToken : token})
        Cookies.set("refreshToken", token, { expires:7});
    }, 
    clearRefreshToken : () => {
        set({refreshToken : null})
        Cookies.remove("refreshToken");
    }, 

    setTokens : (token : AuthToken) => {
        set({
            refreshToken: token.refreshToken,
            accessToken : token.accessToken
        })
        Cookies.set("accessToken", token.accessToken, { expires:7});
        Cookies.set("refreshToken", token.refreshToken, { expires:7});
    },
    clearTokens : () => {
        set({
            refreshToken : null,
            accessToken : null,
        })
        
    }

}));
