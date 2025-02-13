
import { Unit } from "../types/Unit";
import { create } from "zustand";
import { ValidationError } from "../types/ApiValidationError";
import { User } from "../types/User";


export const useViewUnitsStore = create<{
    units : Unit[],
    programId : string | null,
    programName : string | null,
    page : number,
    limit : number,
    total : number,
    setUnits : (untis : Unit[]) => void,
    setProgram : (id:string, name:string) => void,
    setPage : (page : number) => void,
    setLimit : (limit : number) => void,
    setTotal : (total : number) => void
}>(set => ({
    units : [],
    programId : null,
    programName : null,
    page : 1,
    limit : 10,
    total : 0,

    setUnits : (units) => {
        set({units : units})
    },
    setProgram: (id, name) => {
        set({programId : id, programName : name})
    },
    setPage : (page) => {
        set({page:page})
    },
    setLimit : (limit) => {
        set({limit:limit})
    },
    setTotal : (total) => {
        set({total : total})
    }
}));

export const useUpdateUnitStore = create<{
    unit : Unit|null
    unitId : string | null
    errors : ValidationError[],
    formData : {
        id : string
        name : string
    }

    setFormData : (name:string, val:string) => void
    clear : () => void
    setUnit : (unit : Unit) => void
    setUnitId : (id : string) => void
    setErrors : (errors : ValidationError[]) => void
}>((set) => ({
    unit: null,
    unitId: null,
    errors: [],
    formData : {
        name : "",
        id : ""
    },
    
    setFormData : (name, val) => {

    },
    setUnit: function (unit: Unit): void {
        set({
            unit : unit,
            formData : {
                name : unit.name,
                id : unit._id
            }
        })
    },
    setUnitId: function (id: string): void {
        set({
            unitId : id,
        })
    },
    setErrors: function (errors: ValidationError[]): void {
        set({
            errors : errors
        })
    },
    clear: () => {
        set({
            unit : null,
            unitId : null,
            errors : []
        })
    }
}
));

export const useUnitHeadStore = create<{
    heads : User[] 
    unitId : string|null
    name : string|null
    setHeads : (users : User[]) => void
    setUnit : (id:string, name : string) => void
    clear : () => void
}>((set) => ({
    heads: [],
    unitId : null,
    name : null,

    setHeads : (users : User[]) => {
        set({heads : users})
    },

    setUnit : (id:string, name:string) => {
        set({unitId : id, name: name})
    },

    clear : () => {
        set({
            heads : [],
            unitId : null
        })
    }
}));

export const useAddFocalStore = create<{
    unit : Unit | null,
    setUnit : (unit:Unit|null) => void
}>((set) => ({
    unit : null,
    setUnit : (unit : Unit|null) => {
        set({ unit });
    }
}));

export const useViewFocalsStore = create<{
    unitId : string|null,
    setUnitId : (unitId:string|null) => void
}>((set) => ({
    unitId : null,
    setUnitId : (unitId : string|null) => {
        set({ unitId });
    }
}));