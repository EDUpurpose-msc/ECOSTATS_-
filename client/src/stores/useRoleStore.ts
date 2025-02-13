import { create } from "zustand";
import { Role } from "../types/Role";

interface RoleState {
    roles : Role[],

    setRoles : (roles : Role[]) => void,
    clearRoles : () => void
}

interface EditRoleState { 
    roles : Role[],
    userId : string|null,

    setUserId : (id:string) => void,
    setRoles : (roles: Role[]) => void,
    removeRole : (userId:string, roleId:string) => void,
    addRole : (userId:string, roleId:string) => void,
    clear : () => void
}

export const useRoleStore = create<RoleState>((set) => ({
    roles : [],
    setRoles : (roles) => set({roles}),
    clearRoles : () => set({roles: []})
}));


export const useEditRoleStore = create<EditRoleState>((set) => ({
    roles : [],
    userId : null,

    setUserId : (id:string) => {
        set({userId:id})
    },
    setRoles : (roles: Role[]) => {     
        set({roles: roles})
    },
    removeRole : (userId:string, roleId:string) => {
        
    },
    addRole : (userId:string, roleId:string) => {
        
    },
    clear: () => {
        set({
            roles: [],
            userId: null
        })
    }

}));

