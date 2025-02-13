import { create } from "zustand";
import { User } from "../types/User";
import Users from "../pages/Admin/Users/Users";
import { set } from "lodash";
import { report } from "process";

interface EditUserState { 
    user : User | null,
    userId : string|null,

    setUserId : (id:string) => void,
    setUser : (user: User) => void,
    clear : () => void
}

interface ViewUsersState { 
    users : User[]

    setUsers : (user: User[]) => void,
    clear : () => void
}

export const useEditUserStore = create<EditUserState>((set) => ({
    user : null,
    userId : null,

    setUserId : (id:string) => {
        set({userId:id})
    },
    setUser : (user: User) => {
        set({user: user})
    },
    clear: () => {
        set({
            user: null,
            userId: null
        })
    }

}));

export const useViewUsersStore = create<ViewUsersState>((set) => ({
    users : [],

    setUsers : (users: User[]) => {
        set({users : users})
    },
    clear : () => {
        set({users : []})
    }
}));

export const useRegisterUserStore = create<{
    isOpen : boolean
    setOpen : (isOpen : boolean) => void
}>((set) => ({
    isOpen : false,

    setOpen : (isOpen : boolean) => {
        set({isOpen})
    }
}));


export const useReportCountStore = create<{
    refresh : boolean
    setRefresh : (refresh : boolean) => void
    reportCount : {toReview : number, toApprove : number}
    setReportCount : (reportCount : {toReview : number, toApprove : number}) => void
}>((set) => ({
    refresh : false,    
    
    setRefresh : (refresh : boolean) => {   
        set({refresh})   
    },

    reportCount : {toReview : 0, toApprove : 0},
    setReportCount : (reportCount : {toReview : number, toApprove : number}) => {
        console.log("reportCount", reportCount)
        set({reportCount})
    }
}));